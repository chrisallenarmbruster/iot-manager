import React from "react"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"
import Table from "react-bootstrap/Table"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const About = () => {
  return (
    <Container fluid className="bg-dark h-100 pt-3 pb-5">
      <Container className="text-light">
        <h1 className="h2">About</h1>
        <p>
          <span className="fw-bold mx-1">IoT Manager</span> is my full-stack
          JavaScript implementation for IoT - from sensor to cloud to human. It
          starts with the common PERN stack (PostgreSQL, Express, React/Redux,
          Node.js) and adds a few more technologies to extend the stack to the
          Internet of Things. This includes embedded Javascript for the devices,
          lightweight TCP messaging, an IoT gateway and web sockets for
          real-time data streaming to browsers. The result is a full-stack
          JavaScript implementation for IoT.
        </p>
        <Image src="/images/architecture3.png" fluid rounded className="my-5" />
        <h2 className="h3 mt-5">Live Environment</h2>
        <p>
          This is a "live" environment. All dashboard values are based on
          real-time data pushes from the server when they are received from
          actual IoT devices. The devices are located in my home and are
          connected to the Internet via my home Wi-Fi network. Event logs are
          based on actual data measured by these devices.
        </p>
        <h2 className="h3 mt-5">"Things" Used in this PoC</h2>
        <p>
          The Internet of Things hardware used in this proof of concept includes
          three Espressif ESP32 series system-on-a-chip microcontrollers. This
          particular hardware was chosen due to its low cost (&lt;US$6),
          integrated Wi-Fi and the availability of tools for building a lean
          custom-tailored runtime environment for JavaScript. Each
          microcontroller is paired with an Analog Devices TMP36 temperature
          sensor, connecting to the controller's analog-to-digital converter
          (ADC) input.
        </p>
        <Table striped bordered hover variant="dark" className="my-4">
          <thead>
            <tr>
              <td>Spec</td>
              <td>Value</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Microcontroller</td>
              <td>Espressif ESP32</td>
            </tr>
            <tr>
              <td>Cost</td>
              <td>&lt; US$6</td>
            </tr>
            <tr>
              <td>CPU</td>
              <td>Dual Xtensa® 32-bit LX6</td>
            </tr>
            <tr>
              <td>Clock</td>
              <td title="Compare to 2 GHz+ typical cloud virtual machine.">
                Adjustable 80-240 MHz
              </td>
            </tr>
            <tr>
              <td>ROM</td>
              <td>448 kB</td>
            </tr>
            <tr>
              <td>RAM</td>
              <td title="Compare to 250 MB - 1.5 GB hosted Node,js app.">
                520 kB
              </td>
            </tr>
            <tr>
              <td>Storage</td>
              <td title="Compare to 1.4 GB Grace Shopper project.">4 MB</td>
            </tr>
            <tr>
              <td>Network</td>
              <td>Wi-Fi & BLE Radios</td>
            </tr>
            <tr>
              <td>GPIOs</td>
              <td>34 Programmable</td>
            </tr>
            <tr>
              <td>ADC</td>
              <td>12-bit 18 Channels</td>
            </tr>
            <tr>
              <td>Sensor</td>
              <td>TMP36 Temp. Sensor</td>
            </tr>
          </tbody>
        </Table>
        <Row xs={1} md={2} className="g-5">
          <Col className="g-5  d-flex flex-column  px-5 align-items-center">
            <Image
              src="/images/esp32-in-hand.png"
              fluid
              rounded
              className="my-5"
            />
          </Col>
          <Col className="g-5  d-flex flex-column px-5 align-items-center">
            <Image
              src="/images/esp32-with-tmp36.png"
              fluid
              rounded
              style={{ maxWidth: "80%" }}
              className="my-5"
            />
          </Col>
        </Row>
        <h2 className="h3 mt-5">Challenges</h2>
        <p>
          Perhaps the most challenging aspect of this project was the embedded
          software and its runtime environment. The Espressif ESP32
          microcontroller is a powerful and versatile device for its size and
          cost, but it is not a general-purpose computer. It has very limited
          resources and a different architecture than a cloud server or personal
          computer. The RAM and storage are a tiny fraction of what is available
          on a typical client or server, and hence the runtime environment must
          be lean. This required a custom build of the runtime engine for
          JavaScript, tailored specifically for this app. It also meant that
          advanced packages usual in a Node.js environment, such as Express and
          Axios, were not available. As such, lower level coding was necessary,
          but was handled in JavaScript nonetheless.
        </p>
      </Container>
    </Container>
  )
}

export default About
