require("dotenv").config();
const monitor = require("./Monitor");

async function main() {
  await monitor.start();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
