class CreateInitialTables extends require("../Migration") {
  async body(index, database) {
    let done = false;
    let sql = await this.sql();

    // await sql.schema.dropTableIfExists("investments");

    if (!(await sql.schema.hasTable("investments"))) {
      await sql.schema.createTable("investments", (table) => {
        table.increments("id").primary();
        table.float("amount").notNullable();
        table.string("wallet").notNullable();
        table.timestamp("created_at").defaultTo(sql.fn.now());

        // to be sure we do not insert two times the same amount by wallet
        table.string("tx_hash").notNullable();
      });
      done = true;
      console.info('Table "investments" created.');
    }

    // if (!(await sql.schema.hasColumn('investments', 'user_discord_id'))) {
    //   await sql.schema.alterTable('investments', t => {
    //     t.string('user_discord_id')
    //   })
    //   done = true
    //   console.info('Add "user_discord_id" to "investments".')
    // }

    if (!done) {
      console.info("No change required for this migration");
    }
  }
}

module.exports = CreateInitialTables;
