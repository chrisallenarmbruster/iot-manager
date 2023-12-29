const conn = require("./conn")

const { STRING, BOOLEAN, UUID, UUIDV4, DATE, ENUM, BIGINT, FLOAT } =
  conn.Sequelize

const Device = conn.define("device", {
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
})

module.exports = Device
