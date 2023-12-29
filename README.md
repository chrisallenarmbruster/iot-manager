# IoT Manager

**IoT Manager** is my full-stack JavaScript implementation for Internet of Things (IoT) applications. It covers everything from sensors to the cloud, with a web-based human interface, back-end server, API, and IoT gateway. Additionally, it includes embedded JavaScript for IoT devices that seamlessly integrate with the server's IoT gateway.

![IoT Manager Architecture](/static/images/architecture3.png)

## About

IoT Manager extends the common PERN stack (PostgreSQL, Express, React/Redux, Node.js) to incorporate IoT technologies. Here's an overview of what you'll find in this project:

- **Embedded JavaScript**: Custom-tailored runtime environment for JavaScript that runs on IoT devices.
- **Lightweight TCP Messaging**: Efficient communication protocol for IoT devices.
- **IoT Gateway**: A central hub for IoT data that facilitates communication between devices and the web interface.
- **Real-time Data Streaming**: WebSocket support for real-time data streaming to web browsers.

## Live Environment

This repository includes a "live" environment where all dashboard values are based on real-time data received from actual IoT devices. The devices can be located locally at the developer's site and connect to the Internet via a local Wi-Fi network. .

## "Things" Used in this Implementation

Hardware used:

- **Microcontroller**: Espressif ESP32
- **Cost**: < US$6
- **CPU**: Dual Xtensa® 32-bit LX6
- **Clock**: Adjustable 80-240 MHz (Compare to 2 GHz+ typical cloud virtual machine)
- **ROM**: 448 kB
- **RAM**: 520 kB (Compare to 250 MB - 1.5 GB hosted Node.js app)
- **Storage**: 4 MB (Compare to 1.4 GB Grace Shopper project)
- **Network**: Wi-Fi & BLE Radios
- **GPIOs**: 34 Programmable
- **ADC**: 12-bit 18 Channels
- **Sensor**: TMP36 Temperature Sensor

![ESP32 Microcontroller](/static/images/esp32-in-hand.png)
![ESP32 with TMP36 Sensor](/static/images/esp32-with-tmp36.png)

## Challenges

One of the most significant challenges in this project was developing the embedded software and its runtime environment. The Espressif ESP32 microcontroller, while powerful and cost-effective, has limited resources compared to a typical client or server. This necessitated a custom build of the JavaScript runtime engine, tailored specifically for this application. Advanced packages commonly used in a Node.js environment, such as Express and Axios, were not available, leading to lower-level coding in JavaScript.

---

For more details and usage instructions, please refer to the project's documentation and source code.
