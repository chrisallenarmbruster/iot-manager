import secrets from "secrets";
import WiFi from "PersistentWiFi";
import Net from "net";
import { Socket } from "socket";
import Timer from "timer";
import Analog from "pins/analog";
import { createNode } from "DCPNode";

let push;

WiFi.mode = 1;

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
    dcpNode.listen(secrets.LISTEN_PORT, (req, res) => {
      trace(`Received request:\n${JSON.stringify(req, null, 2)}\n`);
      res.setHeader("Content-Type", "text/plain");
      res.setBody(`Request received at ${Date.now()}!`);
      res.send();
    });

    push = Timer.set(
      () => {
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
                label: "Office",
                location: "Home",
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
          null,
          "EVENT",
          "dcp://dcp.domain.com/temperature",
          "DCP/1.0",
          secrets.REQUEST_TRANSPORT_LAYER,
          { "Content-Type": "application/json" },
          null
        );

        req.setBody(body);

        trace(`Broadcasting Temperature Event:\n${body}\n`);

        dcpNode.sendMessage(
          req,
          secrets.IOT_GATEWAY_ADDRESS,
          secrets.IOT_GATEWAY_PORT,
          req.protocol,
          (res) => {
            trace(
              `\n\nReceived formatted DCP response:\n\n${res.getFormattedMessage()}`
            );
            trace(
              `\n\nParsed into Response Object:\n${JSON.stringify(
                res,
                null,
                2
              )}`
            );
            trace(
              `\n\nCalled response handler for transaction-id ${res.getHeader(
                "TRANSACTION-ID"
              )}...\n\n`
            );
          }
        );
      },
      5000,
      30000
    );
  }
}
