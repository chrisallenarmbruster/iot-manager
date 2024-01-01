# IoT Manager

**IoT Manager** is my full-stack JavaScript implementation for Internet of Things (IoT) applications. It covers everything from sensors to the cloud and back down to humans, with a web-based interface, back-end server, API, and IoT gateway. Additionally, it includes embedded JavaScript for IoT devices that seamlessly integrate with the server's IoT gateway.

[![IoT Manager Composite](/server/static/images/iot-manager-composite.png)](https://iotmanager.rev4labs.com/)

### [👆 Click Here to See Live Deployment of IoT Manager](https://iotmanager.rev4labs.com/)

This deployed demo is a "live" environment where all dashboard values are based on real-time data received from actual IoT devices running the code in this repo. The IoT devices are implemented using ESP32 microcontrollers and TMP36 temperature sensors. They are located locally at my home and connect to the Internet via a local Wi-Fi network. When first starting the client interface, it may take a few seconds for the IoT devices to check in with the server and begin sending data.

## Features

IoT Manager extends the common PERN stack (PostgreSQL, Express, React/Redux, Node.js) to incorporate IoT technologies running embedded JavaScript. Here's an overview of what you'll find in this project:

- **Node Express Server**: A back-end server that provides an API for the web interface and IoT devices.
- **IoT Gateway**: A central hub for IoT data that facilitates communication between devices and the web interface. This is part of the server.
- **Embedded JavaScript**: Custom-tailored runtime environment for JavaScript that runs on IoT devices. This communicates with the IoT gateway on the server.
- **React/Redux SPA Interface**: A single-page application (SPA) built with React and Redux provides a user-friendly interface for humans to interact with the IoT data. It offers real-time data visualization and device management capabilities.
- **Lightweight TCP Messaging**: Efficient communication protocol for IoT devices.
- **Real-time Data Streaming**: WebSocket support for real-time data streaming to web browsers.
- **PostgreSQL Integration**: The server uses a PostgreSQL database for data persistence. This allows for long-term storage of IoT data, enabling historical data analysis and trend identification. The database also stores configuration and state information for the IoT devices.

#### Software Architecture

![IoT Manager Architecture](/server/static/images/architecture4.png)

## Screenshots

#### Things Dashboard

![Things Dashboard](/server/static/images/iot-manager-things-dashboard.png)

<br>

#### Event Chart

![Event Chart](/server/static/images/iot-manager-event-chart.png)

<br>

#### Device Browser

![ Device Browser](/server/static/images/iot-manager-device-browser.png)

<br>

#### Device Details

![Device Details](/server/static/images/iot-manager-device-details.png)

<br>

#### Event Tracker

![Event Tracker](/server/static/images/iot-manager-event-tracker.png)

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

The software for the "Things" in this project is written in JavaScript. It is built and flashed onto the IoT hardware using the Moddable SDK. The Moddable SDK is a combination of development tools and runtime software to create applications for microcontrollers. It allows developers to build applications using standard JavaScript which is then compiled ahead of time into a more efficient format that can be executed directly by the the XS JavaScript engine. This is different from the typical process in a browser or Node.js environment, where JavaScript is usually interpreted or just-in-time (JIT) compiled. This makes it possible to run JavaScript on microcontrollers with limited resources and an ideal choice for this project.

<br>

#### ESP32 Microcontroller

![ESP32 Microcontroller](/server/static/images/esp32-in-hand.png)

<br>

#### Wiring Diagram

![ESP32 with TMP36 Sensor](/server/static/images/esp32-with-tmp36.png)

<br>

## Requirements

Before you can install and run this project, you'll need the following:

1. **Node.js:** The server for this project is built with Node.js. You'll need to have Node.js installed on your machine. You can download it from [here](https://nodejs.org/).

2. **PostgreSQL Database:** This project uses a PostgreSQL database. You'll need to have PostgreSQL installed and set up on your machine. You can download it from [here](https://www.postgresql.org/download/). Alternatively, you can access a PostgreSQL database installed on another machine, provided you can create a database on it and access it via a connection string.

3. **ESP32 Microcontroller:** The IoT devices for this project are built with the ESP32 microcontroller. You'll need to have one or more ESP32 devices.

4. **TMP36 Temperature Sensor:** The IoT devices in this project use the TMP36 temperature sensor. You'll need to have one or more TMP36 sensors.

5. **Moddable SDK:** The software for the IoT devices is built and flashed using the Moddable SDK. You'll need to have the Moddable SDK installed and configured on your machine. You can download it from [here](https://www.moddable.com/).

6. **Web Browser:** To view the app, you'll need a modern web browser like Chrome, Firefox, Safari, or Edge.

Ensure that all these requirements are met before proceeding with the installation.

<br>

## Installation

Follow these steps to install and run the project:

1. **Clone the project:**

   Clone the project repository from GitHub. You can do this using the `git clone` command in your terminal:

   ```bash
   git clone https://github.com/chrisallenarmbruster/iot-manager.git
   ```

   Navigate to the cloned repository:

   ```bash
   cd iot-manager
   ```

2. **Install the dependencies:**

   Navigate to the project directory if you are not already in it and install the dependencies using npm:

   ```bash
    npm install
   ```

3. **Create a PostgreSQL database:**

   Create a PostgreSQL database named `iot-manager`. You can do this using the `createdb` command in your terminal:

   ```bash
   createdb iot-manager
   ```

4. **Set up environment variables:**

   Create a `.env` file in the root of your project directory or set environment variables accordingly. You can use the provided `envSample` file as a template. Fill in the variables with your own values.

   This includes the following important variables:

   - `PORT`: This is the port number on which your app will run. For example, if you set `PORT=3000`, you'll be able to access your app at `http://localhost:3000`.

   - `DATABASE_URL`: This is the connection string for your PostgreSQL database. It should be in the format `postgresql://USER:PASSWORD@localhost:5432/iot-manager`, replacing `USER` and `PASSWORD` with your PostgreSQL username and password.

   Here's an example of what your `.env` file might look like:

   ```bash
   PORT=3000
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/iot-manager
   ```

   Replace `USER` and `PASSWORD` with your actual PostgreSQL username and password.

5. **Set SSID, WiFI password, and server address in the IoT source code:**

   In the `iot` directory, open the `main.js` file and set the `ssid`, `password`, and `serverAddress` variables to match your local network. The `serverAddress` is referring to the address of the machine running the server. This is the machine that the IoT devices will connect to.

   ```javascript
   const ssid = "YOUR_SSID";
   const password = "YOUR_WIFI_PASSWORD";
   const serverAddress = "YOUR_SERVER_ADDRESS";
   ```

6. **Build and flash the IoT file:**

   With the esp32 connected to your workstation, navigate to the `iot` directory and build/flash/run the IoT file using the Moddable SDK (**you must have this properly installed and configured on your machine**):

   ```bash
   cd iot
   mcconfig -d -m -p esp32/nodemcu
   ```

<br>

## Usage

Follow these steps to use the project:

1. **Start the server and build the client-side code:**

   In the root of your project directory, start the server and build the client-side code in development mode using npm:

   ```bash
   npm run start:dev
   ```

   The server should now be running and connected to your `iot-manager` database, and your client-side code should be built and ready to serve.

2. **Power up the flashed ESP32 devices:**

   Ensure that your ESP32 devices are connected to power. They should automatically connect to the server and start sending data.

3. **Open the app in a web browser:**

   Open your web browser and navigate to `http://localhost:PORT`, replacing `PORT` with the port number you specified in your `.env` file. For example, if you set `PORT=3000`, you would navigate to `http://localhost:3000`.

   You should now be able to see the data from your ESP32 devices in the app.

<br>

## Engineers

### [🧑 Chris Armbruster](https://github.com/chrisallenarmbruster)

<br>

## License

Copyright (c) 2023 Rev4Labs

This project is MIT licensed.
