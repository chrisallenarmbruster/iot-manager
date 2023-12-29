const conn = require("./conn")
const Device = require("./device")
const DeviceConfig = require("./deviceconfig")
const Event = require("./event")

Event.belongsTo(Device)
Device.hasMany(Event)
DeviceConfig.belongsTo(Device)
Device.hasOne(DeviceConfig)

module.exports = {
  conn,
  Device,
  DeviceConfig,
  Event,
}
