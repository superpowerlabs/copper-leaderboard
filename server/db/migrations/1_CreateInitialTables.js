class CreateInitialTables extends require("../Migration") {
  async body(index, database) {
    let done = false;
    let sql = await this.sql();

    // await sql.schema.dropTableIfExists("investments");

    if (!(await sql.schema.hasTable("investments"))) {
      await sql.schema.createTable("investments", (t) => {
        t.increments("id").primary();
        t.bigInteger("amount").notNullable();
        t.string("wallet").notNullable();
        t.timestamp("created_at").defaultTo(sql.fn.now());
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