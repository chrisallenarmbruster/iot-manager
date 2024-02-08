require("dotenv").config();
const server = require("./app");
const { conn, Event, Device, DeviceConfig } = require("./db");

const init = async () => {
  try {
    await conn.sync({ force: false, alter: true });
    const port = process.env.PORT || 3000;
    server.listen(port, () =>
      console.log(
        `Listening for HTTP messages on TCP transport layer of port ${port}...`
      )
    );
  } catch (ex) {
    console.log(ex);
  }
};

init();
