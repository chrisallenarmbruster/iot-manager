class DCPResponse {
  constructor(protocol, responseSocket, version, rinfo = null) {
    this.protocol = protocol;
    this.responseSocket = responseSocket;
    this.version = version;
    this.headers = {};
    this.rinfo = rinfo;
    this.destinationPort = null;
    this.statusCode = 200;
    this.statusMessage = "OK";
    this.body = null;
  }

  setStatus(code, message) {
    this.statusCode = code;
    this.statusMessage = message;
  }

  setHeader(name, value) {
    this.headers[name.toLowerCase()] = value;
  }

  getHeader(name) {
    return this.headers[name.toLowerCase()];
  }

  setBody(body) {
    this.body = body;
  }

  async send(body, keepConnectionOpen = false) {
    if (body !== undefined) {
      if (typeof body === "object" && !(body instanceof String)) {
        if (!this.getHeader("content-type")) {
          this.setHeader("content-type", "application/json");
        }
        this.body = JSON.stringify(body);
      } else {
        console.log("body:", body);
        this.body = body;
      }
    }

    let response = this.getFormattedMessage();
    if (this.protocol === "TCP") {
      let messageBuffer = ArrayBuffer.fromString(response);
      this.responseSocket.write(messageBuffer);

      if (!keepConnectionOpen) {
        this.responseSocket.close();
      }
    } else if (this.protocol === "UDP" && this.rinfo) {
      let messageBuffer = ArrayBuffer.fromString(response);
      this.responseSocket.write(
        this.rinfo.address,
        this.destinationPort || this.rinfo.port || 2500,
        messageBuffer
      );
    }
  }

  getFormattedMessage() {
    let response = `${this.version} ${this.statusCode} ${this.statusMessage}\r\n`;
    for (const [key, value] of Object.entries(this.headers)) {
      response += `${key.toLowerCase()}: ${value}\r\n`;
    }

    let formattedBody = this.body;
    if (
      typeof this.body === "object" &&
      this.getHeader("content-type") === "application/json"
    ) {
      formattedBody = JSON.stringify(this.body);
    }

    response += `\r\n${formattedBody}`;
    return response;
  }
}

export default DCPResponse;
