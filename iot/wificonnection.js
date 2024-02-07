/*
	Connection is designed to be used in place of the "wifi" module in projects
	that need a continuously available connection to a Wi-Fi access point.

		- If no connection avaiable at start, retries until one is
		- Automatically attempts to reconnect when connection dropped
		- Disconnects when calling close
		- Supresses redundant WiFi.disconnect messages
		- Callback uses same message constants as "wifi"
		- Getter on "ready" is convenient way to check if Wi-Fi is connected
		- If connection attempt does not succeed with an IP address in 30 seconds, forces disconnect and retries
		- Wait 5 seconds after (unforced) disconnect to ensure clean reconnect
*/

import WiFi from "wifi";
import Timer from "timer";
import Digital from "pins/digital";

let blinker;

function blink(on = true, speed = 1000) {
  let blink;

  if (blinker) {
    Timer.clear(blinker);
  }

  if (on) {
    blink = 1;
    blinker = Timer.repeat(() => {
      blink = blink ^ 1;
      Digital.write(2, blink);
    }, speed);
  }
}

class Connection extends WiFi {
  #options;
  #callback;
  #reconnect;
  #connecting;
  #state = WiFi.disconnected;

  constructor(options, callback) {
    options = { ...options };
    Digital.write(2, 1);
    blink(true, 125);

    super(options, (msg, code) => {
      if (WiFi.disconnected === msg) {
        blink(true, 125);
        if (this.#connecting) {
          Timer.clear(this.#connecting);
        }
        this.#connecting = undefined;

        this.#reconnect ??= Timer.set(() => {
          this.#reconnect = undefined;

          let options = this.#options;
          if (false === options) {
            this.#connecting = undefined;
            return;
          }

          WiFi.connect(options);

          this.#connecting = Timer.set(() => {
            this.#connecting = undefined;
            WiFi.disconnect();
          }, 30 * 1000);
        }, 5 * 1000);
        if (this.#state !== WiFi.disconnected) {
          this.#state = WiFi.disconnected;
          this.#callback?.(msg, code);
        }

        return;
      }

      if (WiFi.connected === msg) {
        Timer.clear(this.#reconnect);
        this.#reconnect = undefined;
        blink(true, 250);
      } else if (WiFi.gotIP === msg) {
        Timer.clear(this.#connecting);
        this.#connecting = undefined;
        blink(true, 500);
      }

      this.#state = msg;

      this.#callback?.(msg, code);
    });

    this.#connecting = Timer.set(() => {
      this.#connecting = undefined;
      WiFi.disconnect();
    }, 30 * 1000);

    this.#callback = callback;
    this.#options = options;
  }
  close() {
    Timer.clear(this.#reconnect);
    this.#reconnect = undefined;

    Timer.clear(this.#connecting);
    this.#connecting = undefined;

    WiFi.disconnect();
    super.close();
  }

  get ready() {
    return WiFi.gotIP === this.#state;
  }
}

export default Connection;
