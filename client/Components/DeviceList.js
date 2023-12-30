import React from "react"
import { connect } from "react-redux"
import Container from "react-bootstrap/Container"
import Table from "react-bootstrap/Table"
import { Link } from "react-router-dom"

const DeviceList = (props) => {
  return (
    <Container fluid className="bg-dark h-100 py-5">
      <Container className="text-light ">
        <h1 className="h2">Devices Found: {props.devices?.length}</h1>
        <Table className=" text-light">
          <thead>
            <tr>
              <th>Device Label</th>
              <th>ID</th>
              <th>Make</th>
              <th>Model</th>
              <th>MAC Addr</th>
            </tr>
          </thead>
          <tbody>
            {props.devices?.map((device) => {
              return (
                <tr key={device.id}>
                  <td>{device.deviceconfig.label}</td>
                  <td>
                    <Link
                      to={`/devices/${device.id}`}
                      className="text-info text-decoration-none"
                    >
                      {device.id}
                    </Link>
                  </td>
                  <td>{device.make}</td>
                  <td>{device.model}</td>
                  <td>{device.mac}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Container>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    devices: state.deviceAll.data,
  }
}

export default connect(mapStateToProps)(DeviceList)
