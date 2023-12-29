const conn = require("./conn")
const Device = require("./device")

const { STRING, BOOLEAN, UUID, UUIDV4, DATE, ENUM, BIGINT, FLOAT } =
  conn.Sequelize

const Event = conn.define("event", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  make: {
    type: STRING,
    allowNull: true,
  },
  model: {
    type: STRING,
    allowNull: true,
  },
  mac: {
    type: STRING,
    allowNull: true,
  },
  ip: {
    type: STRING,
    allowNull: true,
  },
  event: {
    type: STRING,
    allowNull: true,
  },
  property: {
    type: STRING,
    allowNull: true,
  },
  value: {
    type: STRING,
    allowNull: true,
  },
  valueunit: {
    type: STRING,
    allowNull: true,
  },
  stringvalue: {
    type: STRING,
    allowNull: true,
  },
  booleanvalue: {
    type: BOOLEAN,
    allowNull: true,
  },
  intvalue: {
    type: BIGINT,
    allowNull: true,
  },
  floatvalue: {
    type: FLOAT,
    allowNull: true,
  },
  time: { type: DATE, defaultValue: conn.Sequelize.NOW },
})

Event.addHook("beforeCreate", async (event) => {
  const device = await Device.findOrCreate({
    where: {
      mac: event.mac,
    },
    defaults: { make: event.make, model: event.model },
  })
  event.deviceId = device[0].id
})

module.exports = Event
