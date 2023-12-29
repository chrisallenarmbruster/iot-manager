const db = require("../db")
const Device = require("./device")
const DeviceConfig = require("./deviceconfig")

async function setup() {
  const devices = await Device.findAll()
  await devices[0].createDeviceconfig({ label: "Family Room" })
  await devices[1].createDeviceconfig({ label: "Office" })
  await devices[2].createDeviceconfig({ label: "Outdoor" })
}

setup()
