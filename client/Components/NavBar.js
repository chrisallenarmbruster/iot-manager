import React from "react"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"

function NavBar() {
  return (
    <Navbar
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      variant="dark"
      className="text-light"
    >
      <Container>
        <Navbar.Brand href="#/" className="text-light">
          IoT Manager
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="text-light"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto text-light">
            <Nav.Link href="#devices" className="text-light">
              Devices
            </Nav.Link>
            <Nav.Link href="#/events" className="text-light">
              Events
            </Nav.Link>
            <Nav.Link href="#/dashboard" className="text-light">
              Dashboard
            </Nav.Link>

            <Nav.Link href="#/about" className="text-light">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
