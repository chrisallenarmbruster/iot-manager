import WiFi from "wifi/connection";
import secrets from "secrets";
import Net from "net";
import { Socket } from "socket";
import Timer from "timer";
import Analog from "pins/analog";
import { createNode } from "DCPNode";

WiFi.mode = 1;

let push;

const LISTEN_PORT = 2500;
const THING_TWO_HOST = "192.168.1.255";
const THING_TWO_PORT = 2500;

trace(`Setting Wi-Fi network (SSID): ${secrets.WIFI_NETWORK_NAME}\n`);

new WiFi(
  {
    ssid: secrets.WIFI_NETWORK_NAME,
    password: secrets.WIFI_PASSWORD,
  },
  function (msg) {
    trace(`Wi-Fi ${msg}\n`);
    switch (msg) {
      case WiFi.gotIP:
        trace(`IP: ${Net.get("IP")}\n`);
        trace(`MAC Address: ${Net.get("MAC")}\n`);
        trace(`Date/Time: ${Date.now()}\n`);
        trace(`Starting Temperature Monitor\n`);
        sendTemp(true);
        break;

      case WiFi.connected:
        trace(`Connected to Wi-Fi network (SSID): ${Net.get("SSID")}\n`);
        break;

      case WiFi.disconnected:
        sendTemp(false);
        break;
    }
  }
);

function sendTemp(on = true) {
  if (!on) {
    Timer.clear(push);
  } else {
    let dcpNode = createNode("ESP32-DevKitC-32");
    dcpNode.listen(LISTEN_PORT, (req, res) => {
      trace(`Received request:\n${JSON.stringify(req, null, 2)}\n`);
      res.setHeader("Content-Type", "text/plain");
      res.setBody(`Request received at ${Date.now()}!`);
      res.send();
    });

    push = Timer.repeat(() => {
      let temperature = ((Analog.read(0) / 1023) * 330 - 50) * 1.8 + 32;
      let body = JSON.stringify(
        {
          DCP: {
            version: "1.0",
            host: {
              make: "Espressif",
              model: "ESP32-DevKitC-32",
              mac: Net.get("MAC"),
              ip: Net.get("IP"),
              data: {
                objects: {
                  temperature_sensor_1: {
                    events: {
                      temperature_reading: {
                        floatvalue: temperature,
                        value: temperature.toFixed(2),
                        valueunit: "fahrenheit",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        null,
        2
      );

      const req = dcpNode.createRequestMessage(
        "CANCEL",
        "EVENT",
        "dcp://dcp.domain.com/temperature",
        "DCP/1.0",
        "UDP",
        { "Content-Type": "application/json" },
        "Hello, World!"
      );

      req.setHeader("Content-Length", req.body.length);
      req.setBody(body);

      trace(`Broadcasting Temperature Event:\n${body}\n`);

      dcpNode.sendMessage(
        req,
        THING_TWO_HOST,
        THING_TWO_PORT,
        req.protocol,
        (res) => {
          trace(
            `\n\nReceived formatted DCP response:\n\n${res.getFormattedMessage()}`
          );
          trace(
            `\n\nParsed into Response Object:\n${JSON.stringify(res, null, 2)}`
          );
          trace(
            `\nCalled response handler for transaction-id ${res.getHeader(
              "TRANSACTION-ID"
            )}...`
          );
          trace(
            `\nBooyah! I am the last command in the response handler you registered. S'up?\n`
          );
        }
      );
    }, 30000);
  }
}
