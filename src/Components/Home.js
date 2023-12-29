import React from "react"
import Container from "react-bootstrap/Container"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <Container
      fluid
      className="bg-dark h-100 text-secondary px-4 py-5 text-center"
    >
      <div className="py-5">
        <h1 className="display-5 fw-bold text-white">IoT Manager</h1>
        <div className="col-lg-6 mx-auto">
          <p className="fs-5 mb-4">
            The Internet of Things depends on the successful integration of
            unconventional networked devices and disparate platforms. This
            includes embedded software, IoT gateways, UI dashboards, data
            analytics and cloud services.
            <span className="text-info fw-bold mx-1">IoT Manager</span> is my
            full-stack JavaScript implementation for IoT - from sensor to cloud
            to human. It is a work in progress, but please dive in and explore
            the exciting potential that awaits!
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link to="/devices">
              <button
                type="button"
                className="btn btn-outline-info btn-lg px-2"
              >
                Device Browser
              </button>
            </Link>
            <Link to="/events">
              <button
                type="button"
                className="btn btn-outline-info btn-lg px-2"
              >
                Event Tracker
              </button>
            </Link>
            <Link to="/dashboard">
              <button
                type="button"
                className="btn btn-outline-info btn-lg px-2"
              >
                Things Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Home
