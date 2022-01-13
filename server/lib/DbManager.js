const Sql = require("../db/Sql");

class DbManager extends Sql {
  // for reference
  // https://knexjs.org

  async getInvestments() {
    const investments = (await this.sql()).select("*").from("investments");
    return investments;
  }

  async newInvestment(amount, wallet, tx_hash, network) {
    const sql = await this.sql();
    // const exist = (
    //   await sql.select("*").from("investments").where({
    //     tx_hash,
    //   })
    // ).rows[0];
    // if (exist) {
    //   throw new Error("Investment already inserted in the db");
    // }
    if (network === "kovan") {
    try {
      await sql
        .insert({
          amount,
          wallet,
          tx_hash,
        })
        .into("investments");
      return true;
    } catch (e) {
      // console.log(e);
    }
  }
  if (network === "mainnet") {
    try {
      await sql
        .insert({
          amount,
          wallet,
          tx_hash,
        })
        .into("investments_production");
      return true;
    } catch (e) {
      // console.log(e);
    }
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
