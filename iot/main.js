import { Request } from "http";
import WiFi from "wifi";
import Timer from "timer";
import Digital from "pins/digital";
import Analog from "pins/analog";
import Net from "net";

const ssid = "Edit Me"; // your WiFi SSID
const password = "Edit Me"; // your WiFi password
const serverAddress = "Edit Me"; // your server address (e.g. what is running the IoT Gateway)
let blinker;
let push;

trace(`Attempting to set up WiFi connection on ${ssid}\n`);
blink(true, 1500);

let connecting = true;
let connectionWasEstablished = false;

WiFi.mode = 1;

const myWiFi = new WiFi({ ssid: ssid, password: password }, function (msg) {
  trace(`WiFi - ${msg}\n`);
  switch (msg) {
    case WiFi.gotIP:
      trace(`Authentication successful.\n`);
      trace(`Got IP: ${Net.get("IP")}\n`);
      trace(`MAC Address: ${Net.get("MAC")}\n`);
      blink(true, 500);
      sendTemp(true);
      connecting = false;
      connectionWasEstablished = true;
      break;

    case WiFi.connected:
      trace(`Wi-Fi connected to "${Net.get("SSID")}"\n`);
      trace(`Authenticating..."\n`);
      blink(true, 1000);
      break;

    case WiFi.disconnected:
      connecting = false;
      blink(false);
      sendTemp(false);
      if (connectionWasEstablished) {
        trace("Connection lost!\n");
        trace("Attempting to reconnect...\n");
        connecting = true;
        WiFi.connect({ ssid: ssid, password: password }); // try to reconnect
      } else {
        trace("Failed to connect.  Will try again in 15 seconds.\n");
        Timer.set(() => {
          WiFi.connect({ ssid: ssid, password: password });
        }, 15000);
      }
      break;
  }
});

function blink(on = true, speed = 1000) {
  let blink;
  Timer.clear(blinker);

  if (on) {
    blink = 1;
    blinker = Timer.repeat(() => {
      blink = blink ^ 1;
      Digital.write(2, blink);
    }, speed);
  }
}

function sendTemp(on = true) {
  if (!on) {
    Timer.clear(push);
  } else {
    push = Timer.repeat(() => {
      let temperature = ((Analog.read(0) / 1023) * 330 - 50) * 1.8 + 32;
      let body = JSON.stringify({
        make: "Espressif",
        model: "ESP32-DevKitC-32",
        mac: Net.get("MAC"),
        ip: Net.get("IP"),
        event: "temperature_reading",
        property: "temperature_sensor_1",
        floatvalue: temperature,
        value: temperature.toFixed(2),
        valueunit: "fahrenheit",
      });

      let request = new Request({
        address: serverAddress,
        port: 51130,
        method: "POST",
        body: body,
        response: String,
        headers: ["Content-Type", "application/json"],
      });

      request.callback = function (message, value) {
        if (Request.responseComplete === message) {
          trace(`Response from API Server:\n${value}\n`);
        }
      };
    }, 30000);
  }
}
