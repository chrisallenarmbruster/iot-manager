const conn = require("./conn")

const { STRING, BOOLEAN, UUID, UUIDV4, DATE, ENUM, BIGINT, FLOAT } =
  conn.Sequelize

const DeviceConfig = conn.define("deviceconfig", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  label: {
    type: STRING,
    allowNull: true,
  },
  location: {
    type: STRING,
    allowNull: true,
  },
})

module.exports = DeviceConfig
