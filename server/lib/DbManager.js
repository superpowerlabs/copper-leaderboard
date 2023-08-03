const Sql = require("../db/Sql");

let dbw;
let dbr;
class DbManager extends Sql {
  // for reference
  // https://knexjs.org

  async init() {
    dbw = await this.sql();
    dbr = await this.sql(true); // read only
    this.initiated = true;
  }
  async getInvestments(network) {
    const investments = dbr.select("*").from("investments_" + network);
    return investments;
  }

  async newInvestment(amount, wallet, tx_hash, network) {
    const exist = (
      await dbw
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
      await dbw
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
