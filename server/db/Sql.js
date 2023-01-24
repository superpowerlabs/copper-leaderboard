const knex = require("knex");
const Spinner = require("cli-spinner").Spinner;
const _ = require("lodash");
const dbConfig = require("./dbConfig");

async function sleep(millis) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setTimeout(resolve, millis));
}

const { pgData } = require("../config");

class Sql {
  constructor() {
    this.pgData = pgData;
  }

  async sql(useReplica) {
    let clientKey = "client";
    if (useReplica) {
      clientKey = "replicaClient";
    }
    if (!this[clientKey]) {
      const spinner = new Spinner("Waiting for Postgres %s ");
      spinner.setSpinnerString("|/-\\");
      let started = false;
      const config = _.clone(dbConfig);
      if (useReplica) {
        config.connection.host = config.connection.hostReplica;
      }
      for (;;) {
        try {
          this[clientKey] = knex(config);
          await this[clientKey].raw("select 1+1 as result");
          spinner.stop();
          break;
        } catch (err) {
          if (/database ".*" does not exist/.test(err)) {
            await sleep(1000);
            const { connection } = config;
            let tmpClient = knex({
              client: "pg",
              connection: {
                host: connection.host,
                user: connection.user,
                password: connection.password,
                port: connection.port,
              },
            });
            try {
              await tmpClient.raw("create database " + connection.database);
            } catch (e) {
              // most likely trying to re-create an already created database
            }
            spinner.stop();
            break;
          } else {
            // console.error(err);
          }
        }
        await sleep(1000);
        if (!started) {
          spinner.start();
          started = true;
        }
      }
    }
    return this[clientKey];
  }
}

module.exports = Sql;
