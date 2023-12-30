# IoT Manager

**IoT Manager** is my full-stack JavaScript implementation for Internet of Things (IoT) applications. It covers everything from sensors to the cloud and back down to humans, with a web-based interface, back-end server, API, and IoT gateway. Additionally, it includes embedded JavaScript for IoT devices that seamlessly integrate with the server's IoT gateway.

[![IoT Manager Composite](/static/images/iot-manager-composite.png)](https://iotmanager.rev4labs.com/)

<a href="https://iotmanager.rev4labs.com/" style="font-size: 20px; font-weight: bold;">Click Here to See Live Deployment of IoT Manager</a>
This deployed demo is a "live" environment where all dashboard values are based on real-time data received from actual IoT devices running the code in this repo. The IoT devices are implemented using ESP32 microcontrollers and TMP36 temperature sensors. They are located locally at my home and connect to the Internet via a local Wi-Fi network. When first starting the client interface, it may take a few seconds for the IoT devices to check in with the server and begin sending data.

## Features

IoT Manager extends the common PERN stack (PostgreSQL, Express, React/Redux, Node.js) to incorporate IoT technologies running embedded JavaScript. Here's an overview of what you'll find in this project:

- **Node Express Server**: A back-end server that provides an API for the web interface and IoT devices.
- **IoT Gateway**: A central hub for IoT data that facilitates communication between devices and the web interface. This is part of the server.
- **Embedded JavaScript**: Custom-tailored runtime environment for JavaScript that runs on IoT devices. This communicates with the IoT gateway on the server.
- **Lightweight TCP Messaging**: Efficient communication protocol for IoT devices.
- **Real-time Data Streaming**: WebSocket support for real-time data streaming to web browsers.

#### Software Architecture

![IoT Manager Architecture](/static/images/architecture4.png)

## Screenshots

#### Things Dashboard

![Things Dashboard](/static/images/iot-manager-things-dashboard.png)

<br>

#### Event Chart

![Event Chart](/static/images/iot-manager-event-chart.png)

<br>

#### Device Browser

![ Device Browser](/static/images/iot-manager-device-browser.png)

<br>

#### Device Details

![Device Details](/static/images/iot-manager-device-details.png)

<br>

#### Event Tracker

![Event Tracker](/static/images/iot-manager-event-tracker.png)

<br>

## "Things" Used in this Project

#### Hardware used:

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

#### Software used:

The software for the "Things" in this project is written in JavaScript. It is built and flashed onto the IoT hardware using the Moddable SDK. The Moddable SDK is a combination of development tools and runtime software to create applications for microcontrollers. It allows developers to build applications using standard JavaScript which is then compiled ahead of time into a more efficient format that can be executed directly by the the XS JavaScript engine. This is different from the typical process in a browser or Node.js environment, where JavaScript is usually interpreted or just-in-time (JIT) compiled. This make it possible to run JavaScript on microcontrollers with limited resources and an ideal choice for this project.

<br>

#### ESP32 Microcontroller

![ESP32 Microcontroller](/static/images/esp32-in-hand.png)

<br>

#### Wiring Diagram

![ESP32 with TMP36 Sensor](/static/images/esp32-with-tmp36.png)

<br>

## Engineers

- [Chris Armbruster](https://github.com/chrisallenarmbruster)

<br>

## License

Copyright (c) 2023 Rev4Labs

This project is MIT licensed.
