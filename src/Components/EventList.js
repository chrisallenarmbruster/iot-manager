import React, { Component } from "react"
import { connect } from "react-redux"
import { setEvents } from "../store/eventAll"
import Container from "react-bootstrap/Container"
import Table from "react-bootstrap/Table"
import { Link } from "react-router-dom"

export class EventList extends Component {
  componentDidMount() {
    this.props.setEvents()
  }

  render() {
    return (
      <Container fluid className="bg-dark h-100 py-5">
        <Container className="text-light">
          <h1 className="h2">Event Log</h1>
          <h2 className="h4 mb-3">All Devices </h2>
          {this.props.isLoading ? (
            "Loading..."
          ) : (
            <div className="">
              <Table className="table text-light">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Device Label</th>
                    <th scope="col">Event</th>
                    <th scope="col">Property</th>
                    <th scope="col" className="text-center">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.events?.map((event) => (
                    <tr key={event.id}>
                      <td>
                        {new Date(event.time).toLocaleString("en-US", {})}
                      </td>
                      <td>
                        <Link
                          to={`/devices/${event.deviceId}`}
                          className="text-decoration-none text-info"
                        >
                          {event.device.deviceconfig.label}
                        </Link>
                      </td>
                      <td>{event.event}</td>
                      <td>{event.property}</td>
                      <td className="text-center">
                        {event.floatvalue.toFixed(0)}
                      </td>
                    </tr>
                  ))}
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
  events: state.eventAll.data,
  isLoading: state.eventAll.isLoading,
})

const mapDispatchToProps = (dispatch) => ({
  setEvents: () => dispatch(setEvents()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventList)
