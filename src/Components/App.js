import React, { Component, Fragment } from "react"
import { socket } from "../socket"
// import NavBar from './Navbar';
import { Routes, Route, Navigate } from "react-router-dom"
import { connect } from "react-redux"
import { setDevices } from "../store/deviceAll"
import Dashboard from "./Dashboard"
import { updateDeviceCurrentValue } from "../store/deviceCurrentValues"
import NavBar from "./NavBar"
import DeviceList from "./DeviceList"
import About from "./About"
import DeviceSingle from "./DeviceSingle"
import EventList from "./EventList"
import Home from "./Home"

class App extends Component {
  constructor() {
    super()
    this.state = {
      isConnected: socket.connected,
      deviceEvents: [],
    }
  }

  onConnect() {
    this.setState({ isConnected: true })
  }

  onDisconnect() {
    this.setState({ isConnected: false })
  }

  onDeviceEvent(value) {
    this.setState({ deviceEvents: [...this.state.deviceEvents, value] })
    this.props.updateDeviceCurrentValue(value)
  }

  async componentDidMount() {
    await this.props.setDevices()

    socket.on("connect", this.onConnect.bind(this))
    socket.on("disconnect", this.onDisconnect.bind(this))
    socket.on("device event", this.onDeviceEvent.bind(this))
  }

  componentWillUnmount() {
    socket.off("connect", this.onConnect.bind(this))
    socket.off("disconnect", this.onDisconnect.bind(this))
    socket.off("foo", this.onDeviceEvent.bind(this))
  }

  render() {
    return (
      <Fragment>
        <NavBar />
        <Fragment>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/devices/:id" element={<DeviceSingle />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Fragment>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return { devices: state.deviceAll.data, isLoading: state.deviceAll.isLoading }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setDevices: () => dispatch(setDevices()),
    updateDeviceCurrentValue: (value) =>
      dispatch(updateDeviceCurrentValue(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
