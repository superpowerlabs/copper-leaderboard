const { Pool } = require("pg")

const pool = new Pool({
    user: "postgres",
    password: "iKANTknowIT",
    database: "postgres",
    host: "localhost",
    port: "5432"
});