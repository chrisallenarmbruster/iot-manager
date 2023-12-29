require("dotenv").config()
const server = require("./app")
const { conn, Event, Device, DeviceConfig } = require("./db")

const init = async () => {
  try {
    await conn.sync({ force: false })
    const port = process.env.PORT || 3000
    server.listen(port, () => console.log(`listening on port ${port}`))
  } catch (ex) {
    console.log(ex)
  }
}

init()
