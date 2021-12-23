const dbManager = require("../server/lib/DbManager");

async function sleep(millis) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setTimeout(resolve, millis));
}

class Monitor {
  async getEvents() {
    let events;

    await sleep(1000);
    return events;
  }

  async start() {
    let i = 1;
    for (;;) {
      console.log(i++);
      let newEvents = await this.getEvents();
    }
  }
}

module.exports = new Monitor();
