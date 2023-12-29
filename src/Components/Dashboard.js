import React from "react"
import { connect } from "react-redux"
import DeviceCard from "./DeviceCard"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const Dashboard = (props) => {
  return (
    <Container fluid className="bg-dark h-100 my-5">
      <Container className="text-dark">
        <Row xs={1} sm={2} md={2} lg={3} className="g-5">
          {props.deviceAll.map((device) => {
            return (
              <Col key={device.id} className="g-5">
                <DeviceCard key={device.id} deviceId={device.id} />
              </Col>
            )
          })}
        </Row>
      </Container>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    deviceAll: state.deviceAll.data,
    deviceCurrentValues: state.deviceCurrentValues,
  }
}

export default connect(mapStateToProps)(Dashboard)
