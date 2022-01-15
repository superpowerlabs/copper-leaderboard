const Sql = require("../db/Sql");

class DbManager extends Sql {
  // for reference
  // https://knexjs.org

  async getInvestments(network) {
    const investments = (await this.sql())
      .select("*")
      .from("investments_" + network);
    return investments;
  }

  async newInvestment(amount, wallet, tx_hash, network) {
    const sql = await this.sql();
    const exist = (
      await sql
        .select("*")
        .from("investments_" + network)
        .where({
          tx_hash,
        })
    )[0];
    if (exist) {
      return false;
    }
    try {
      await sql
        .insert({
          amount,
          wallet,
          tx_hash,
        })
        .into("investments_" + network);
      return true;
    } catch (e) {
      // console.log(e);
    }
  }

  // EXAMPLE:
  // async updatePlayer(user_discord_id) {
  //   const sql = await this.sql();
  //   await sql("tetris_players")
  //     .where({
  //       user_discord_id,
  //     })
  //     .update({
  //       game_started_at: Date.now(),
  //     });
  // }
}

let dbManager;
if (!dbManager) {
  dbManager = new DbManager();
}
module.exports = dbManager;
