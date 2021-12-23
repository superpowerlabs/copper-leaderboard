const Sql = require('../db/Sql')

class DbManager extends Sql {


  // examples

  // async getPlayer(user_discord_id, now) {
  //   const sql = await this.sql()
  //   const rows = await sql.select('*')
  //     .from('tetris_players')
  //     .where({
  //       user_discord_id
  //     })
  //   return rows[0]
  // }

  // async setPlayer(user_discord_id) {
  //   const row = await this.getPlayer(user_discord_id)
  //   if (row) {
  //     await this.updatePlayer(user_discord_id)
  //   } else {
  //     const sql = await this.sql()
  //     await sql.insert({
  //       user_discord_id,
  //       game_started_at: Date.now()
  //     })
  //       .into('tetris_players')
  //   }
  // }
  //
  // async updatePlayer(user_discord_id) {
  //   const sql = await this.sql()
  //   await sql('tetris_players')
  //     .where({
  //       user_discord_id
  //     })
  //     .update({
  //       game_started_at: Date.now()
  //     })
  // }

}

let dbManager
if (!dbManager) {
  dbManager = new DbManager()
}
module.exports = dbManager

