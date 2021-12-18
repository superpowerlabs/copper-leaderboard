const Sql = require('../db/Sql')
const ethers = require('ethers')

// const cacheOra = {
//   when: 0,
//   diff: 0
// }

const cacheIP = {}

class DbManager extends Sql {

  generateRandomCode(typeIndex) {
    let code = ethers.utils.id('code' + Math.random()).substring(2, 16).toUpperCase()
    if (typeof typeIndex !== 'undefined') {
      code = typeIndex + code.substring(1)
    }
    return '0x' + code
  }

  async getData(where) {
    const rows = await (await this.sql())
      .select('*')
      .from('codes')
      .where(where)
    return rows[0]
  }

  async getPlayer(user_discord_id, now) {
    const sql = await this.sql()
    const rows = await sql.select('*')
      .from('tetris_players')
      .where({
        user_discord_id
      })
    return rows[0]
  }

  //
  // async giveMeOffset() {
  //   if (Date.now() - cacheOra.when > 60000) {
  //     const sql = await this.sql()
  //     let ora = ((await sql.schema.raw('select now() as ora')).rows[0]).ora
  //     ora = (new Date(ora)).getTime()
  //     const when = Date.now()
  //     cacheOra.diff = when - ora
  //     cacheOra.when = when
  //   }
  //   return cacheOra.diff
  // }

  async setPlayer(user_discord_id) {
    const row = await this.getPlayer(user_discord_id)
    if (row) {
      await this.updatePlayer(user_discord_id)
    } else {
      const sql = await this.sql()
      await sql.insert({
        user_discord_id,
        game_started_at: Date.now()
      })
        .into('tetris_players')
    }
  }

  async updatePlayer(user_discord_id) {
    const sql = await this.sql()
    await sql('tetris_players')
      .where({
        user_discord_id
      })
      .update({
        game_started_at: Date.now()
      })
  }

  async updateCodes(user_discord_id, data) {
    const sql = await this.sql()
    await sql('codes')
      .where({
        user_discord_id
      })
      .update(data)
  }

  async banUser(full_username, redeem_code, user_discord_id) {

  }

  async countSeason() {
    const season = process.env.CURRENT_SEASON
    if (!this.seasons) {
      this.seasons = {}
    }
    if (!this.seasons[season]) {
      this.seasons[season] = 0
    }
    if (this.seasons[season] < 200) {
      const sql = await this.sql()
      const count = await sql('codes')
        .count('redeemed')
        .where({
          type_index: parseInt(season)
        })
      this.seasons[season] = count[0].count
    }
    return this.seasons[season]
  }

  async showQuery(query) {
    return query.toSQL().toNative()
  }

  async getRowsByType(type_index) {
    //
    // console.log((await this.sql())
    //   .select('*')
    //   .from('codes')
    //   .where('type_index', arg ? '<' : '=', 4).toSQL().toNative())
    //
    return (await this.sql())
      .select('*')
      .from('codes')
      .where({type_index})
  }

  async createCode(full_username, user_discord_id, type_index) {
    const redeemed = await this.getData({
      full_username,
      redeemed: true
    }, true) || {}
    if (redeemed.redeemed) {
      return redeemed
    }
    const code = await this.getData({
      full_username,
      type_index
    }, true)
    if (code) {
      code.already_set = true
      return code
    } else {
      let auth_code = this.generateRandomCode()
      await (await this.sql())
        .insert({
          full_username,
          type_index,
          auth_code,
          user_discord_id
        })
        .into('codes')
      return this.getData({
        full_username
      })
    }
  }

  async isIpWhitelisted(ip) {
    if (cacheIP[ip]) {
      return {ip}
    }
    const rows = await (await this.sql())
      .select('*')
      .from('whitelisted_ips')
      .where({
        ip
      })
    return rows[0]
  }

  async setWhitelisted(ip) {
    const is = await this.isIpWhitelisted(ip)
    if (is && is.ip) {
      await this.updateWhitelisted(ip)
    } else {
      const sql = await this.sql()
      await sql.insert({
        ip
      })
        .into('whitelisted_ips')
      cacheIP[ip] = true
    }
  }

  async updateWhitelisted(ip) {
    const sql = await this.sql()
    await sql('whitelisted_ips')
      .where({
        ip
      })
      .update({
        updated_at: sql.fn.now()
      })
    cacheIP[ip] = true
  }

  async createCodeV2(full_username, user_discord_id, type_index) {
    let auth_code = this.generateRandomCode()
    await (await this.sql())
      .insert({
        full_username,
        type_index,
        user_discord_id,
        auth_code
      })
      .into('codes')
    return this.getData({
      full_username
    })
  }

  async setRedeemCode(full_username, user_discord_id) {
    const code = await this.getData({
      full_username
    })
    if (code) {
      if (code.redeem_code) {
        return code
      } else {
        const sql = await this.sql()
        const data = {
          redeem_code: this.generateRandomCode(code.type_index),
          redeem_code_set_at: sql.fn.now(),
          user_discord_id
        }
        await sql('codes')
          .where({
            full_username
          })
          .update(data)
        return this.getData({
          full_username
        })
      }
    } else {
      return false
    }
  }

  async getRedeemCodeV2(user_discord_id) {
    const code = await this.getData({
      user_discord_id
    })
    if (code) {
      if (code.redeemed) {
        return false
      }
      if (code.redeem_code) {
        code.already_set = true
        return code
      } else {
        const sql = await this.sql()
        const data = {
          redeem_code: this.generateRandomCode(code.type_index),
          redeem_code_set_at: sql.fn.now()
        }
        await sql('codes')
          .where({
            user_discord_id
          })
          .update(data)
        return this.getData({
          user_discord_id
        })
      }
    } else {
      return false
    }
  }

  async saveHashAndSignature(
    redeem_code,
    redeemer,
    auth_code_bytes32,
    signed_hash,
    signature) {
    return (await this.sql())('codes')
      .where({
        redeem_code
      })
      .update({
        redeemer,
        auth_code_bytes32,
        signed_hash,
        signature
      })

  }

  async setCodeAsUsed(full_username, token_id) {
    const code = await this.getData({
      full_username
    })
    if (code && code.redeem_code) {
      const sql = await this.sql()
      const data = {
        redeem_code_used_at: sql.fn.now(),
        redeemed: true,
        token_id
      }
      return sql('codes')
        .where({
          full_username
        })
        .update(data)
    } else {
      return false
    }
  }

}

let dbManager
if (!dbManager) {
  dbManager = new DbManager()
}
module.exports = dbManager

