const dcpNode = require("./dcp/dcp").createNode("dcp-gateway");
const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const path = require("path");
const volleyball = require("volleyball");
const { Device, Event } = require("./db");

app.use(volleyball);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "static/index.html"))
);

app.use("/api", require("./api"));

app.post("/", async (req, res, next) => {
  try {
    console.log("Received Payload:\n", req.body);
    const event = await Event.create({ ...req.body });
    io.emit("device event", event);
    res.status(201).send("OK");
  } catch (err) {
    next(err);
  }
});

app.get("*", (req, res) => {
  res.redirect("/");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});

io.on("connection", (socket) => {
  console.log("Browser WebSocket connected.");
  socket.on("disconnect", function () {
    console.log("Browser WebSocket disconnected.");
  });
});

dcpNode.listen(process.env.DCP_LISTEN_PORT || 2500, async (req, res) => {
  let event = req.body.getEvents()[0];
  const eventName = Object.keys(event)[0];
  const formattedEvent = {
    make: event[eventName].host.make,
    model: event[eventName].host.model,
    mac: event[eventName].host.mac,
    ip: event[eventName].host.ip,
    label: event[eventName].host.label,
    location: event[eventName].host.location,
    event: eventName,
    property: event[eventName].objectPath,
    floatvalue: event[eventName].floatvalue,
    value: event[eventName].value,
    valueunit: event[eventName].valueunit,
  };
  console.log("Received DCP Event Message:\n", event);
  event = await Event.create({ ...formattedEvent });
  io.emit("device event", event);
  res.send(`${eventName} event received`);
});

module.exports = httpServer;
