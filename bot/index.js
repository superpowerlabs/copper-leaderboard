require('dotenv').config()
const Discord = require('discord.js')
const bot = new Discord.Client()
const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')

const db = require('./Db')

const baseUri = process.env.NODE_ENV === 'development'
  ? 'http://localhost:6660' : 'https://nft.syn.city'

const dbManager = require('../server/lib/DbManager')

bot.login(process.env.DISCORD_BOT_TOKEN)

bot.on('ready', () => {

})

bot.on('message', msg => {
  executeCommand(msg)
    .then(res => {
      if (typeof res === 'string') {
        console.info(res)
      }
    })
    .catch(console.error)
})

function fullNickname(user) {
  return (user.username + '#' + user.discriminator).toLowerCase()
}

async function sendMessage(msg, userDiscordID, auth_code, calls) {
  return msg.channel.send(
    `Hi ${userDiscordID}
Your ARG stage ${process.env.CURRENT_SEASON} auth code is \`${auth_code}\`
${calls === 3 ? '**This was your third call. I won\'t respond to you again for this stage**' : ''}`
  )
}

let cachedCalls
let seasonName = 'pledge'

async function executeCommand(msg = {}) {
  let [content, extra] = _.trim(msg.content.replace(/<[^>]+>/g, '')).split(' ')

  const command = process.env.NODE_ENV === 'development'
    ? 'jimi' : seasonName

  if (!msg.member) {
    return
  }
  const {user} = msg.member
  const userDiscordID = user.toString()
  const userId = userDiscordID.replace(/[^\d]/g, '')

  const isFrankie = fullNickname(user) === 'sullof#0095'

  if (/^\/ciao/.test(content)) {
    if (isFrankie) {
      return msg.channel.send(`Ciao ${userDiscordID}`)
    } else {
      return
    }
  }

  if (/^\/spock/.test(content)) {
    if (isFrankie) {
      db.set('cachedCalls', cachedCalls)
      return msg.channel.send(`Hi ${userDiscordID}, done!`)
    } else {
      return
    }
  }

  const currentSeason = parseInt(process.env.CURRENT_SEASON) - 1

  const re = RegExp(`^\\/${command}`)
  if (re.test(content)) {

    if (!cachedCalls) {
      cachedCalls = db.get('cachedCalls')
      if (!cachedCalls) {
        db.set('cachedCalls', {})
      }
    }

    if (!cachedCalls[seasonName]) {
      cachedCalls[seasonName] = {}
    }

    const cache = cachedCalls[seasonName]

    if (!cache[userId]) {
      cache[userId] = 0
    }
    const calls = ++cache[userId]

    if (!isFrankie) {
      if (calls === 10) {
        return msg.channel.send(`Damn, ${userDiscordID}, do not f%#k with me or I will ban you`)
      } else if (calls > 3) {
        return
      }
    }

    let existent = await dbManager.getData({
      user_discord_id: userId,
      type_index: currentSeason
    })

    if (existent) {
      return sendMessage(msg, userDiscordID, existent.auth_code, isFrankie ? 0 : calls)
    } else {
      const count = await dbManager.countSeason()
      if (count < 200) {
        const row = await dbManager.createCodeV2(fullNickname(user), userId, currentSeason)
        sendMessage(msg, userDiscordID, row.auth_code, calls)
      } else {
        msg.channel.send(`I am sorry, ${userDiscordID}, all the tokens for this stage have been minted`)
      }

    }


//
//     content = _.trim(content.replace(re, '')).split(/ +/)
//     let code = content[0].toUpperCase().replace(/X/, 'x')
//
//     if (!/^0x[A-F0-9]{14}$/.test(code)) {
//       return msg.channel.send(`Hey ${userDiscordID}, that code looks invalid`)
//     }
//
//     if (msg.author.bot) {
//       return msg.channel.send(`Whoops! ${userDiscordID}, you look like a bot`)
//     }
//
//     const count = await dbManager.countSeason()
//
//     if (parseInt(count) >= 200) {
//       return msg.channel.send(`Damn ${userDiscordID}, the season has ended`)
//     }
//
//     let pre = await dbManager.getData({
//       user_discord_id: userDiscordID
//     })
//
//     if (pre) {
//       if (pre.redeemed) {
//         return msg.channel.send(`Damn, ${userDiscordID}, it looks like you already minted a pass`)
//       } else if (pre.full_username === fullNickname(user)) {
//
//         console.log(pre)
//
// //         msg.author.send(`Your redeem code is
// //
// // \`${pre.redeemCode}\`
// //
// // Connect to ${baseUri}/redeem-syn-pass to claim your NFT`)
// //         return msg.channel.send(`Hi ${userDiscordID}, please check DM`)
//
// //         msg.author.send(`Your redeem code is
// //
// // \`${pre.redeemCode}\`
// //
// // Connect to ${baseUri}/redeem-syn-pass to claim your NFT`)
//         return msg.channel.send(`Hi ${userDiscordID}, Your redeem code is \`${pre.redeem_code}\`
// Connect to ${baseUri}/redeem-syn-pass to claim your NFT.
// **Only you can use that code**.
// Any other Discord member trying to use it **will be banned** from future mints
// `)
//
//       } else {
// //         msg.author.send(`Hi ${user.username}, you got the redeem code \`${pre.redeemCode}\` as ${pre.full_username}
// // Connect to ${baseUri}/redeem-syn-pass to claim your NFT`)
// //         return msg.channel.send(`Hi ${userDiscordID}, please check DM`)
//
//         return msg.channel.send(`Hi ${user.username}, you got the redeem code \`${pre.redeem_code}\` as ${pre.full_username}
// Connect to ${baseUri}/redeem-syn-pass to claim your NFT.
// **Only you can use that code**.
// Any other Discord member trying to use it **will be banned** from future mints
// `)
//
//       }
//     }
//     let row = await dbManager.getData({
//       auth_code: code
//     })
//     if (!row) {
//       return msg.channel.send(`F#%k, ${userDiscordID}, code not found`)
//     }
//     if (row.full_username.toLowerCase() !== fullNickname(user)) {
//       return msg.channel.send(`Whoops, ${userDiscordID}, that code is reserved to another member`)
//     }
//     if (row.redeemer && row.redeemer.length === 42) {
//       return msg.channel.send(`Naaah, ${userDiscordID}, that code has been already used`)
//     }
//     row = await dbManager.setRedeemCode(fullNickname(user), userDiscordID)
//     let redeemCode = row.redeem_code
//
//     msg.channel.send(`Hi ${userDiscordID}, Your redeem code is \`${redeemCode}\`
// Connect to ${baseUri}/redeem-syn-pass to claim your NFT.
// **Only you can use that code**.
// Any other Discord member trying to use it **will be banned** from future mints
// `)
//
// //     msg.author.send(`Your redeem code is
// //
// // \`${redeemCode}\`
// //
// // Connect to ${baseUri}/redeem-syn-pass to claim your NFT`)
// //     msg.channel.send(`Hi ${userDiscordID}, please check DM`)
//     return `${userDiscordID} got the code ${redeemCode}`
  }
}
