import DCPRequest from "DCPRequest";
import DCPResponse from "DCPResponse";
import DCPJsonBody from "./DCPJsonBody";
import { Socket, Listener } from "socket";
import Timer from "timer";

export default class DCPNode {
  constructor(id) {
    this.id = id;
    this.listenPort = 2500;
    this.messageHandler = null;
    this.responseHandlers = new Map();
    this.defaultResponseHandler = (response) => {
      trace(`Default handler received response:\n${response}`);
    };
    this.defaultTimeout = 30000;
  }

  createResponseMessage(protocol, version, headers = {}, body = "") {
    return new DCPResponse(protocol, null, version, null, headers, body);
  }

  createRequestMessage(
    methodOperator,
    requestMethod,
    requestUri,
    version,
    protocol,
    headers = {},
    body = ""
  ) {
    const request = new DCPRequest(
      methodOperator,
      requestMethod,
      requestUri,
      version,
      protocol,
      headers,
      body
    );
    request.setHeader("listen-port", this.listenPort);

    return request;
  }

  async sendMessage(
    message,
    targetIpAddress,
    targetPort,
    protocol,
    responseHandler = null,
    timeout = null
  ) {
    if (!message.getHeader("listen-port")) {
      message.setHeader("listen-port", this.listenPort);
    }
    if (message instanceof DCPRequest) {
      if (!message.getHeader("transaction-id")) {
        message.setTransactionId();
      }
      if (responseHandler) {
        this.responseHandlers.set(
          message.getHeader("transaction-id"),
          responseHandler
        );

        Timer.set(() => {
          this.responseHandlers.delete(message.getHeader("transaction-id"));
        }, timeout || this.defaultTimeout);
      }
    }

    if (protocol === "TCP") {
      return await this._sendTCPMessage(message, targetIpAddress, targetPort);
      // return;
    } else if (protocol === "UDP") {
      return this._sendUDPMessage(message, targetIpAddress, targetPort);
    } else {
      trace("Unsupported protocol");
    }
  }

  _sendTCPMessage(message, targetIpAddress, targetPort) {
    return new Promise((resolve, reject) => {
      const formattedMessage = message.getFormattedMessage();

      let client = new Socket({ address: targetIpAddress, port: targetPort });
      let transactionId, handler;

      client.callback = (callbackMessage, value, etc) => {
        switch (callbackMessage) {
          case Socket.connected:
            client.write(ArrayBuffer.fromString(formattedMessage));
            if (!(message instanceof DCPRequest)) {
              client.close();
              resolve();
            }
            break;

          case Socket.readable:
            if (message instanceof DCPRequest) {
              let data = client.read(String);

              if (data.length > 0) {
                client.close();
                try {
                  const response = this._parseResponse(data, "TCP", null, null);
                  transactionId = message.getHeader("TRANSACTION-ID");
                  let handler =
                    this.responseHandlers.get(transactionId) ||
                    this.defaultResponseHandler;

                  let result = handler(response);
                  if (result && typeof result.then === "function") {
                    result
                      .then(() => {
                        if (this.responseHandlers.has(transactionId)) {
                          this.responseHandlers.delete(transactionId);
                        }
                        resolve(response);
                      })
                      .catch((err) => {
                        reject(err);
                      });
                  } else {
                    resolve(response);
                  }
                } catch (err) {
                  reject(err);
                }
              }
            }
            break;

          case Socket.error:
            trace("TCP Error: " + value + "\n");
            client.close();
            reject(new Error("TCP Error: " + value));
            break;
        }
      };
    });
  }

  _sendUDPMessage(message, targetIpAddress, targetPort) {
    const formattedMessage = message.getFormattedMessage();
    let messageBuffer = ArrayBuffer.fromString(formattedMessage);

    this.udpServer.write(targetIpAddress, targetPort, messageBuffer);
    trace("UDP Message Sent\n");

    return "UDP Message Sent";
  }

  listen(listenPort, messageHandler) {
    this.messageHandler = messageHandler;
    this.listenPort = listenPort;
    this._setupUDPServer(this.listenPort);
    this._setupTCPServer(this.listenPort);
  }

  _setupTCPServer(port) {
    let tcpListener = new Listener({
      port: port,
    });

    tcpListener.callback = () => {
      let tcpServer = new Socket({ listener: tcpListener });
      tcpServer.callback = (callbackMessage, value) => {
        if (Socket.readable === callbackMessage) {
          let data = tcpServer.read(String);
          if (data.length > 0) {
            this._handleIncomingMessage(data, "TCP", tcpServer);
            tcpServer.close();
          }
        }
      };
    };
    trace(`Listening for TCP messages on port ${port}...\n`);
  }

  _setupUDPServer(port) {
    this.udpServer = new Socket({ kind: "UDP", port: port });

    this.udpServer.callback = (message, value, remoteIP, remotePort) => {
      if (message === Socket.readable) {
        let msg = String.fromArrayBuffer(this.udpServer.read(ArrayBuffer));
        let rinfo = { address: remoteIP, port: remotePort };
        this._handleIncomingMessage(msg, "UDP", this.udpServer, rinfo);
      }
    };

    trace(`Listening for UDP messages on port ${port}...\n`);
  }

  _handleIncomingMessage(rawMessage, protocol, responseSocket, rinfo) {
    try {
      const parsedMessage = this._parseMessage(
        rawMessage,
        protocol,
        responseSocket,
        rinfo
      );
      if (parsedMessage instanceof DCPResponse) {
        try {
          const response = parsedMessage;
          const transactionId = response.getHeader("transaction-id");

          const handler =
            this.responseHandlers.get(transactionId) ||
            this.defaultResponseHandler;
          handler(response);

          if (this.responseHandlers.has(transactionId)) {
            this.responseHandlers.delete(transactionId);
          }

          return response;
        } catch (err) {
          trace(`Error handling response:\n${err}\n`);
        }
      } else if (parsedMessage instanceof DCPRequest) {
        let version = "DCP/1.0";
        const res = new DCPResponse(protocol, responseSocket, version, rinfo);
        res.setHeader(
          "transaction-id",
          parsedMessage.getHeader("transaction-id")
        );
        res.destinationPort = parsedMessage.getHeader("listen-port") || 2500;
        res.setHeader("listen-port", this.listenPort);
        if (this.messageHandler) {
          this.messageHandler(parsedMessage, res);
        }
      }
    } catch (err) {
      trace(`Error handling incoming message:\n${err}\n`);
    }
  }

  _parseMessage(rawMessage, protocol, responseSocket, rinfo) {
    const firstLine = rawMessage.split("\r\n")[0];

    if (this._isResponse(firstLine)) {
      return this._parseResponse(rawMessage, protocol, responseSocket, rinfo);
    } else {
      return this._parseRequest(rawMessage, protocol, responseSocket, rinfo);
    }
  }

  _isResponse(firstLine) {
    const responsePattern = /^DCP\/\d+\.\d+ \d{3} /;
    return responsePattern.test(firstLine);
  }

  _parseRequest(rawMessage, protocol, responseSocket, rinfo) {
    const lines = rawMessage.split("\r\n");

    const requestLine = lines[0];
    const parts = requestLine.split(" ");
    if (parts.length !== 3) return null;

    let methodOperator = null;
    let requestMethod;
    let requestUri, version;

    const methodIndex = parts[0].indexOf("!");
    if (methodIndex !== -1) {
      methodOperator = parts[0].substring(0, methodIndex);
      requestMethod = parts[0].substring(methodIndex + 1);
    } else {
      requestMethod = parts[0];
    }
    [requestUri, version] = [parts[1], parts[2]];

    const headers = {};
    let lineIndex = 1;
    while (lineIndex < lines.length && lines[lineIndex]) {
      const headerLine = lines[lineIndex];
      const separatorIndex = headerLine.indexOf(":");
      if (separatorIndex === -1) return null;

      const headerName = headerLine
        .substring(0, separatorIndex)
        .trim()
        .toLowerCase();
      const headerValue = headerLine.substring(separatorIndex + 1).trim();
      headers[headerName] = headerValue;
      lineIndex++;
    }

    let body = null;
    if (lineIndex < lines.length - 1) {
      const rawBody = lines.slice(lineIndex + 1).join("\r\n");
      const contentType = headers["content-type"];
      if (contentType === "application/json") {
        try {
          body = new DCPJsonBody(rawBody);
        } catch (error) {
          trace(`Error parsing JSON body:\n${error}`);
        }
      } else {
        body = rawBody;
      }
    }

    return new DCPRequest(
      methodOperator,
      requestMethod,
      requestUri,
      version,
      protocol,
      headers,
      body
    );
  }

  _parseResponse(rawMessage, protocol, responseSocket, rinfo) {
    const lines = rawMessage.split("\r\n");

    const statusLine = lines[0];
    const statusParts = statusLine.split(" ");
    if (statusParts.length < 3) return null;

    const version = statusParts[0];
    const statusCode = parseInt(statusParts[1], 10);
    const statusMessage = statusParts.slice(2).join(" ");

    const headers = {};
    let lineIndex = 1;
    while (lineIndex < lines.length && lines[lineIndex]) {
      const headerLine = lines[lineIndex];
      const separatorIndex = headerLine.indexOf(":");
      if (separatorIndex === -1) return null;

      const headerName = headerLine
        .substring(0, separatorIndex)
        .trim()
        .toLowerCase();
      const headerValue = headerLine.substring(separatorIndex + 1).trim();
      headers[headerName] = headerValue;
      lineIndex++;
    }

    let body = null;
    if (lineIndex < lines.length && lines[lineIndex] === "") {
      const rawBody = lines.slice(lineIndex + 1).join("\r\n");
      const contentType = headers["content-type"];
      if (contentType === "application/json") {
        try {
          body = new DCPJsonBody(rawBody);
        } catch (error) {
          trace(`Error parsing JSON body:\n${error}`);
        }
      } else {
        body = rawBody;
      }
    }

    const response = new DCPResponse(protocol, responseSocket, version, rinfo);
    response.setStatus(statusCode, statusMessage);
    for (const [key, value] of Object.entries(headers)) {
      response.setHeader(key, value);
    }

    if (body !== null) {
      response.setBody(body);
    }

    return response;
  }
}

export function createNode(id) {
  return new DCPNode(id);
}
