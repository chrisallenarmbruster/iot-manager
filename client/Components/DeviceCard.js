import React from "react"
import { connect } from "react-redux"
import Card from "react-bootstrap/Card"
import Spinner from "react-bootstrap/Spinner"
import { Link } from "react-router-dom"

const DeviceCard = (props) => {
  const deviceId = props.deviceId
  return (
    <Link to={`/devices/${props.device.id}`} n className="text-decoration-none">
      <Card
        className="h-100\ bg-info text-dark p-2"
        title={`${props.device.model} | MAC: ${props.device.mac} ${
          props.deviceCurrentValues.length > 0
            ? `| IP: ${props.deviceCurrentValues[0]?.ip}`
            : ""
        }`}
      >
        <Card.Title className="fw-bold">
          {props.device.deviceconfig.label}
        </Card.Title>
        {/* <Card.Subtitle className="text-light">Temperature</Card.Subtitle> */}
        <Card.Body
          className="text-center display-1 fw-bold my-3"
          style={{ minHeight: "125px" }}
        >
          {props.deviceCurrentValues.length > 0 ? (
            <React.Fragment>
              <div>{props.deviceCurrentValues[0]?.value.slice(0, -1)}&deg;</div>
            </React.Fragment>
          ) : (
            <div className="d-flex justify-content-center">
              <Spinner animation="grow" role="status" className="mt-4">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
        </Card.Body>
      </Card>
    </Link>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    device: state.deviceAll.data.find(
      (device) => device.id === ownProps.deviceId
    ),
    deviceCurrentValues: state.deviceCurrentValues.data.filter(
      (deviceCurrentValue) => deviceCurrentValue.deviceId === ownProps.deviceId
    ),
  }
}

export default connect(mapStateToProps)(DeviceCard)
