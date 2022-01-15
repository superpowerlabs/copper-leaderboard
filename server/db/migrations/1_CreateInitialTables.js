const helpers = require("./helpers");

class CreateInitialTables extends require("../Migration") {
  async body(index, database) {
    let done = false;
    let sql = await this.sql();

    // await sql.schema.dropTableIfExists("investments");

    if (!(await sql.schema.hasTable("investments_kovan"))) {
      await sql.schema.createTable("investments_kovan", (table) => {
        table.increments("id").primary();
        table.float("amount").notNullable();
        table.string("wallet").notNullable();
        table.timestamp("created_at").defaultTo(sql.fn.now());

        // to be sure we do not insert two times the same amount by wallet
        table.string("tx_hash").notNullable().unique();
      });
      done = true;
      console.info('Table "investments_kovan" created.');
    }
    //
    // if (!(await helpers.indexExists("investments", "tx_hash_index"))) {
    //   await sql.schema.alterTable("investments", (table) => {
    //     table.unique("tx_hash", "tx_hash_index");
    //   });
    //   done = true;
    //   console.info('Add unique to column "tx_hash" in table "investments".');
    // }

    if (!(await sql.schema.hasTable("investments_homestead"))) {
      await sql.schema.createTable("investments_homestead", (table) => {
        table.increments("id").primary();
        table.float("amount").notNullable();
        table.string("wallet").notNullable();
        table.timestamp("created_at").defaultTo(sql.fn.now());

        // to be sure we do not insert two times the same amount by wallet
        table.string("tx_hash").notNullable().unique();
      });
      done = true;
      console.info('Table "investments_homestead" created.');
    }

    // if (
    //   !(await helpers.indexExists(
    //     "investments_homestead",
    //     "tx_hash_index_production"
    //   ))
    // ) {
    //   await sql.schema.alterTable("investments_homestead", (table) => {
    //     table.unique("tx_hash", "tx_hash_index_production");
    //   });
    //   done = true;
    //   console.info(
    //     'Add unique to column "tx_hash" in table "investments_homestead".'
    //   );
    // }

    if (!done) {
      console.info("No change required for this migration");
    }
  }
}

module.exports = CreateInitialTables;
