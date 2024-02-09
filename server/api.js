const express = require("express");
const app = express.Router();
const Event = require("./db/event");
const Device = require("./db/device");
const DeviceConfig = require("./db/deviceconfig");

module.exports = app;

app.get("/devices", async (req, res, next) => {
  try {
    const devices = await Device.findAll({
      include: [{ model: DeviceConfig }],
    });
    res.send(devices);
  } catch (err) {
    next(err);
  }
});

app.get("/devices/:id/last-event", async (req, res, next) => {
  console.log("req.params.id", req.params.id);
  try {
    const lastEvent = await Event.findOne({
      where: { deviceId: req.params.id },
      order: [["time", "DESC"]],
      limit: 1,
    });

    if (lastEvent) {
      console.log("lastEvent", lastEvent);
      res.send(lastEvent);
    } else {
      res.status(404).send({ message: "No events found for this device." });
    }
  } catch (err) {
    next(err);
  }
});

app.get("/devices/:id", async (req, res, next) => {
  try {
    const device = await Device.findByPk(req.params.id, {
      include: [
        {
          model: DeviceConfig,
        },
      ],
    });
    const events = await Event.findAll({
      where: { deviceId: req.params.id },
      attributes: [
        "id",
        "event",
        "ip",
        "property",
        "value",
        "floatvalue",
        "time",
      ],
      order: [["time", "DESC"]],
      limit: 240,
    });
    res.send({ ...device.dataValues, events });
  } catch (err) {
    next(err);
  }
});

app.get("/events", async (req, res, next) => {
  try {
    const events = await Event.findAll({
      attributes: [
        "id",
        "deviceId",
        "event",
        "ip",
        "property",
        "value",
        "floatvalue",
        "time",
      ],
      include: [{ model: Device, include: [{ model: DeviceConfig }] }],
      order: [["time", "DESC"]],
      limit: 240,
    });
    res.send(events);
  } catch (err) {
    next(err);
  }
});
