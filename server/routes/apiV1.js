const express = require('express')
const router = express.Router()
const ethers = require('ethers')
const pool = require("./pool")
const sigUtil = require('eth-sig-util')
const DiscordOauth2 = require('discord-oauth2')
const dbManager = require('../lib/DbManager')
const Address = require('../../client/utils/Address')
const {signPackedData, getPackedHash, getContract} = require('../lib/utils')
const _ = require('lodash')

// const baseUri = process.env.NODE_ENV === 'development'
//   ? 'http://localhost:6660' : 'https://nft.syn.city'

router.post('/verify-redeem-code', async (req, res) => {
  const connectedWallet = req.get('Connected-wallet')
  const chainId = req.get('Chain-id')
  const msgParams = JSON.parse(req.body.msgParams)
  let recovered = ethers.constants.AddressZero
  try {
    recovered = sigUtil.recoverTypedSignature_v4({
      data: msgParams,
      sig: req.body.signature
    })
  } catch (e) {
  }
  if (Address.equal(recovered, connectedWallet)) {
    const data = JSON.parse(msgParams.message.data)
    const {redeemCode} = data
    const row = await dbManager.getData({
      redeem_code: redeemCode,
      redeemer: connectedWallet
      // TODO add type_index
    })
    if (row) {
      if (!/^0x[A-F0-9]{14}$/.test(redeemCode)) {
        return res.json({
          success: false,
          error: 'Redeem code is invalid'
        })
      } else if (row.redeemed) {
        return res.json({
          success: false,
          error: 'Redeem code already used'
        })
      } else {
        if (row.hash) {
          return res.json({
            success: true,
            member: row.full_username,
            signature: row.signature,
            authCode: row.auth_code_bytes32
          })
        }
        if (connectedWallet !== row.redeemer) {
          return res.json({
            success: false,
            error: 'Redeem code not found'
          })
        }
        let authCode = ethers.utils.id(redeemCode)
        let hash = await getPackedHash(chainId, connectedWallet, authCode, redeemCode)
        if (hash) {
          let signature = await signPackedData(hash)
          await dbManager.saveHashAndSignature(
            redeemCode,
            connectedWallet,
            authCode,
            hash,
            signature
          )
          return res.json({
            success: true,
            member: row.full_username,
            signature,
            authCode
          })
        } else {
          return res.json({
            success: false,
            error: 'Cannot connect to blockchain'
          })
        }
      }
    }
    return res.json({
      success: false,
      error: 'Redeem code not found'
    })
  } else {
    return res.json({
      success: false,
      error: 'Wrong signature'
    })
  }

})

router.post('/set-used-redeem-code/:redeemCode', async (req, res) => {
  const {redeemCode} = req.params
  const {tokenId} = req.body
  const redeemer = req.get('Connected-wallet')
  const row = await dbManager.getData({
    redeem_code: redeemCode,
    redeemer
  })
  if (row) {
    await dbManager.setCodeAsUsed(row.full_username, parseInt(tokenId))
    return res.json({
      success: true
    })
  }
  return res.json({
    success: false,
    error: 'Code not found'
  })
})

// async function returnRedeemCode(req, res, code, typeIndex, count) {
//   if (!/^0x[A-F0-9]{14}$/.test(code)) {
//     res.status(400)
//     return res.json({
//       success: false,
//       message: 'Invalid code'
//     })
//   }
//   const row = await dbManager.getRedeemCodeV2(code)
//   if (row.redeemed) {
//     res.status(410)
//     return res.json({
//       success: false,
//       message: 'Code already used'
//     })
//   }
//   const result = {
//     success: true,
//     url: `${baseUri}/welcome/${row.redeem_code}`,
//     total_minted: count
//   }
//   // if (row.already_set) {
//   //   result.warning = 'Member already registered'
//   // }
//   res.json(result)
// }

// router.get('/new-url-for/:code', async (req, res) => {
//   const count = await dbManager.countSeason()
//   if (parseInt(count) === 200) {
//     return res.json({
//       success: false,
//       message: 'No more pass available for this season',
//       total_minted: 200
//     })
//   }
//   const {hostname} = req
//   if (hostname !== 'localhost') {
//     const authToken = req.get('Auth-token')
//     if (process.env.AUTH_TOKEN && // < in testing the variable will be empty
//       authToken !== process.env.AUTH_TOKEN) {
//       return res.json({
//         error: 403,
//         message: 'Forbidden'
//       })
//     }
//   }
//   let {code} = req.params
//   return returnRedeemCode(req, res, code, undefined, count)
// })

// router.get('/has-minted/:code', async (req, res) => {
//   const redeem_code = req.params.code
//   const redeemer = req.get('Connected-wallet')
//   if (!/^0x[A-F0-9]{14}$/.test(redeemCode) ||
//     !/^0x[a-fA-F0-9]{40}$/.test(redeemer)) {
//     return res.json({
//       success: false
//     })
//   }
//   const row = await dbManager.getData({
//     redeem_code: req.params.code,
//     redeemer: req.get('Connected-wallet')
//   })
//   if (row && row.token_id) {
//     res.json({
//       success: true,
//       tokenId: row.token_id
//     })
//   } else {
//     res.json({
//       success: false
//     })
//   }
// })

async function returnCode(req, res, member, typeIndex) {
  member = member.toLowerCase()
  let tmp = member.split('#')
  if (/[^\w .]/g.test(tmp[0]) || !/^\d{4}$/.test(tmp[1])) {
    return res.json({
      error: 500,
      message: 'Member name should be in `nickname#0000` format'
    })
  }
  const row = await dbManager.createCode(member, typeIndex)
  if (row.already_set && row.type_index !== typeIndex) {
    return res.json({
      success: false,
      error: 'Code already set for different type'
    })
  }
  const result = {
    success: true,
    code: row.auth_code
  }
  if (row.already_set) {
    result.warning = 'Member already registered'
  }
  res.json(result)
}


// router.get('/new-url-for/:member', async (req, res) => {
//   const count = await dbManager.countSeason()
//   if (parseInt(count) === 200) {
//     return res.json({
//       success: false,
//       message: 'No more pass available for this season',
//       total_minted: 200
//     })
//   }
//   const {hostname} = req
//   if (hostname !== 'localhost') {
//     const authToken = req.get('Auth-token')
//     if (process.env.AUTH_TOKEN && // < in testing the variable will be empty
//       authToken !== process.env.AUTH_TOKEN) {
//       return res.json({
//         error: 403,
//         message: 'Forbidden'
//       })
//     }
//   }
//   let {member} = req.params
//   return returnCode(req, res, member, undefined, count)
// })

async function isOperator(req) {
  try {
    const connectedWallet = req.get('Connected-wallet')
    const chainId = req.get('Chain-id')
    const synCityPasses = getContract(chainId, 'SynCityPasses')
    return synCityPasses.operators(connectedWallet)
  } catch (e) {
    return false
  }
}

//
// router.post('/new-code-for', async (req, res) => {
//   const connectedWallet = req.get('Connected-wallet')
//   if (await isOperator(connectedWallet)) {
//     const msgParams = JSON.parse(req.body.msgParams)
//     const recovered = sigUtil.recoverTypedSignature_v4({
//       data: msgParams,
//       sig: req.body.signature
//     })
//     if (Address.equal(recovered, connectedWallet)) {
//       const data = JSON.parse(msgParams.message.data)
//       const {discordMember} = data
//       return returnCode(req, res, discordMember, 4)
//     }
//   }
//   return res.json({
//     error: 403,
//     message: 'Forbidden'
//   })
// })
//
// router.post('/all-codes', async (req, res) => {
//   const connectedWallet = req.get('Connected-wallet')
//
//   await dbManager.countSeason()
//
//   if (await isOperator(connectedWallet)) {
//     const msgParams = JSON.parse(req.body.msgParams)
//     const recovered = sigUtil.recoverTypedSignature_v4({
//       data: msgParams,
//       sig: req.body.signature
//     })
//     if (Address.equal(recovered, connectedWallet)) {
//       const data = JSON.parse(msgParams.message.data)
//       const {typeIndex} = data
//       return res.json({
//         success: true,
//         redeemed: await dbManager.getRowsByType(typeIndex)
//       })
//     }
//   }
//   return res.json({
//     error: 403,
//     message: 'Forbidden'
//   })
// })

router.get('/is-still-valid', async (req, res) => {
  const {accessToken, userId} = req.query
  try {
    const oauth = new DiscordOauth2()
    const user = await oauth.getUser(accessToken)
    if (user && user.id === userId) {
      res.json({
        success: true
      })
    }
  } catch (error) {
    res.json({
      success: false
    })
  }
})


function kriminal(ts) {
  // ts = ts % 1e4
  const R = []
  const is = {}
  for (; ;) {
    let h = ethers.utils.id('' + ts)
    for (let i = 2; i < h.length; i++) {
      let v = parseInt(h.substring(i, i + 1))
      if (!isNaN(v) && v < 7 && !is[v]) {
        R.push(v)
        if (~R.length === -4) {
          return R
        }
        is[v] = 1
      }
      ts++
    }
  }
}

// function fixMedellin(answer) {
//   if (answer === 'nilledeM') {
//     return 'nílledeM'
//   } else {
//     return answer
//   }
// }

// console.log(kriminal(2600))

// router.get('/give-me-the-hash', async (req, res) => {
//   const {accessToken, userId} = req.query
//   try {
//     const oauth = new DiscordOauth2()
//     const user = await oauth.getUser(accessToken)
//     if (user && user.id === userId) {
//       const rc = kriminal(user.discriminator)
//       const hash = ethers.utils.id(JSON.stringify([
//         values[rc[0]],
//         values[rc[1]],
//         values[rc[2]]
//       ]))
//       res.json({
//         success: true,
//         hash
//       })
//     }
//   } catch (error) {
//     res.json({
//       success: false
//     })
//   }
// })

const mintedById = require('../../client/config/minted.json')
const { Pool } = require('pg')
const mintedByAddress = _.invert(mintedById)

//const values = process.env.NODE_ENV === 'development'
  //? 'a,b,c,d,e,f,g'.split(',')
  //: process.env.SOLUTIONS.split(',')

function fixName(city) {
  city = city.replace(/í/, 'i')
  if (city === 'Syn New Jersey City') {
    city === 'Syn Dumont'
  }
  return city
}


router.get('/validate-solution', async (req, res) => {
  const connectedWallet = req.get('Connected-wallet')
  let {accessToken, userId, answer1, answer2, answer3, discriminator} = req.query

  const rc = kriminal(parseInt(discriminator))
  answer1 = answer1.replace(/í/, 'i')
  answer2 = answer2.replace(/í/, 'i')
  answer3 = answer3.replace(/í/, 'i')

  console.log([answer1, answer2, answer3].join(' | '))

  if (answer1 === values[rc[0]] &&
    answer2 === values[rc[1]] &&
    answer3 === values[rc[2]]
  ) {
    console.log('---------------- >>> Right answer')
    try {
      const oauth = new DiscordOauth2()
      const user = await oauth.getUser(accessToken)
      if (!connectedWallet) {
        return res.json({
          success: false,
          error: `${user.username}, you seem not connected to the blockchain`
        })
      }
      if (mintedById[_.trim(user.id)] || mintedByAddress[connectedWallet]) {
        return res.json({
          success: false,
          fatalError: `${user.username}, it looks like you have already minted a Syn Pass`
        })
      }
      if (user && user.id === userId && user.discriminator === discriminator) {
        // const rc = kriminal(parseInt(user.discriminator))
        // answer1 = answer1.replace(/í/, 'i')
        // answer2 = answer2.replace(/í/, 'i')
        // answer3 = answer3.replace(/í/, 'i')

        // if (answer1 === values[rc[0]] &&
        //   answer2 === values[rc[1]] &&
        //   answer3 === values[rc[2]]
        // ) {
        let member = user.username + '#' + user.discriminator
        let row = await dbManager.createCode(member, userId, process.env.CURRENT_SEASON - 1)
        if (row.redeemed) {
          return res.json({
            success: false,
            fatalError: `Damn, ${user.username}, you have already redeemed a Syn Pass`
          })
        }
        await dbManager.updateCodes(user.id, {
          redeem_code: null,
          solved: true,
          redeemer: connectedWallet
        })
        return res.json({
          success: true
        })
      }
    } catch (e) {
      console.error(e.message)
    }
  } else {
    return res.json({
      success: false,
      error: 'Nope. Wrong answer :-('
    })
  }
  return res.json({
    success: false,
    errorCode: 403,
    fatalError: 'Discord authentication failed. Refresh the page!'
  })
})

router.post('/playing-now', async (req, res) => {
  const {accessToken, userId} = req.body
  try {
    const oauth = new DiscordOauth2()
    const user = await oauth.getUser(accessToken)
    if (user && user.id === userId) {
      dbManager.setPlayer({
        user_discord_id: user.id
      })
      return res.json({
        success: true
      })
    }
  } catch (e) {
    // console.log(e.message)
  }
  res.json({
    success: false
  })
})

router.post('/give-me-my-token', async (req, res) => {
  const {accessToken, userId} = req.body
  try {
    const oauth = new DiscordOauth2()
    const user = await oauth.getUser(accessToken)
    if (user && user.id === userId) {
      let row = await dbManager.getData({
        user_discord_id: user.id
      })
      if (row && !row.solved) {
        return res.json({
          success: false,
          error: 'It looks like you did not solve the riddle'
        })
      }
      let step = await dbManager.getPlayer({
        user_discord_id: user.id
      })
      if (!step || !step.game_started_at) {
        return res.json({
          success: false,
          error: `Whoops, ${user.username}, I can't find when you started the game`
        })
      }
      if (row && row.redeemed) {
        return res.json({
          success: false,
          error: `Damn, ${user.username}, you have already redeemed a Syn Pass`
        })
      }
      if (!step) {
        return res.json({
          success: false,
          error: `Uhm, ${user.username}, something looks wrong :-(`
        })
      }
      if (Date.now() - step.game_started_at > 200 * 270) {
        row = await dbManager.getRedeemCodeV2(user.id)
        return res.json({
          success: true,
          redeemCode: row.redeem_code
        })
      }
      return res.json({
        success: false,
        error: `Damn, ${user.username}, you are trying to speed-up :-(`
      })

    }
  } catch (e) {
    console.log(e.message)
  }
  res.json({
    success: false
  })
})

router.use(express.json())
router.get("/contracts", async (req, res) => {
  const contract = await pool.query("SELECT * FROM contracts")
  console.log(contract.rows)
  res.json("contracts")
})

module.exports = router