import React, { Component } from "react"
import { connect } from "react-redux"
import { setSingleDevice, _clearSingleDevice } from "../store/deviceSingle"
import { withRouter } from "../utils/withRouter"
import Container from "react-bootstrap/Container"
import Table from "react-bootstrap/Table"
import EventChartSingle from "./EventChartSingle"

export class DeviceSingle extends Component {
  componentDidMount() {
    const { id } = this.props.router.params
    this.props.setSingleDevice(id)
  }

  componentWillUnmount() {
    this.props.clearSingleDevice()
  }

  render() {
    return (
      <Container fluid className="bg-dark h-100 py-5">
        <Container className="text-light">
          <h1 className="h2">Device Details</h1>
          <h2 className="h5">
            <span>ID: </span>
            <span>{this.props.router.params.id}</span>{" "}
          </h2>
          {this.props.isLoading ? (
            "Loading..."
          ) : (
            <div className="">
              <span className="fw-bold me-4 d-inline-flex flex-nowrap">
                Make:
                <span className="fw-normal ms-2">{this.props.device.make}</span>
              </span>
              <span className="fw-bold me-4 d-inline-flex flex-nowrap">
                Model:
                <span className="fw-normal ms-2">
                  {this.props.device.model}
                </span>
              </span>

              <span className="fw-bold me-4 d-inline-flex flex-nowrap">
                Label:
                <span className="fw-normal ms-2">
                  {this.props.device?.deviceconfig?.label}
                </span>
              </span>
              <div>
                <span className="fw-bold me-4 d-inline-flex flex-nowrap">
                  MAC:
                  <span className="fw-normal ms-2">
                    {this.props.device.mac}
                  </span>
                </span>
                <span className="fw-bold me-4 d-inline-flex flex-nowrap">
                  Last IP:
                  <span className="fw-normal ms-2">
                    {this.props.device?.events?.length &&
                      this.props.device?.events[0]?.ip}
                  </span>
                </span>
              </div>
              <h3 className="h3 mt-4">
                Event Log <EventChartSingle />
              </h3>
              <Table className="table text-light">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Event</th>
                    <th>Property</th>
                    <th className="text-center">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.device?.events?.map((event) => {
                    return (
                      <tr key={event.id}>
                        <td>
                          {new Date(event.time).toLocaleString("en-US", {})}
                        </td>
                        <td>{event.event}</td>
                        <td>{event.property}</td>
                        <td className="text-center">
                          {event.floatvalue.toFixed(0)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Container>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  device: state.deviceSingle.data,
  isLoading: state.deviceSingle.isLoading,
})

const mapDispatchToProps = (dispatch) => ({
  setSingleDevice: (id) => dispatch(setSingleDevice(id)),
  clearSingleDevice: () => dispatch(_clearSingleDevice()),
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DeviceSingle)
)
