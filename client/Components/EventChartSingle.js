import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

export class EventChartSingle extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );

    const eventValues = Array.isArray(this.props.device?.events)
      ? this.props.device.events
          .map((event) => parseFloat(event.value))
          .reverse()
      : [];

    const minValue =
      eventValues.length > 0 ? Math.floor(Math.min(...eventValues) - 5) : 0;
    const maxValue =
      eventValues.length > 0 ? Math.ceil(Math.max(...eventValues) + 5) : 0;

    const options = {
      responsive: true,
      elements: {
        point: {
          radius: 0,
        },
      },
      plugins: {
        legend: {
          position: "top",
          display: false,
        },
        title: {
          display: false,
          text: "Chart.js Line Chart",
        },
      },
      scales: {
        x: {
          grid: {
            color: "#555555",
          },
          border: {
            color: "#555555",
          },
        },
        y: {
          border: {
            color: "#555555",
          },
          grid: {
            color: "#98999A",
          },
          ticks: {
            font: {
              size: 16,
            },
            color: "#0DCAF0",
          },
          min: minValue,
          max: maxValue,
          title: {
            display: true,
            text: "° Fahrenheit",
            font: {
              size: 18,
            },
            color: "#0DCAF0",
          },
        },
      },
    };

    const labels = Array.isArray(this.props.device?.events)
      ? this.props.device.events
          .map((event) =>
            new Date(event.time).toLocaleString("en-US", {}).slice(-11)
          )
          .reverse()
      : [];

    const data = {
      labels,
      datasets: [
        {
          label: "Dataset 1",
          data: eventValues,
          borderColor: "#0DCAF0",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    return (
      <>
        {" "}
        <Button
          className="ms-3"
          variant="outline-info"
          onClick={this.handleShow}
        >
          Chart
        </Button>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
          size="lg"
          className="bg-dark text-light"
        >
          <Modal.Header closeButton className="bg-info text-dark">
            <Modal.Title>
              Event Chart ({this.props.device?.deviceconfig?.label} Temperature)
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <Line options={options} data={data} />
          </Modal.Body>
          <Modal.Footer className="bg-dark text-light">
            <Button variant="outline-info" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  device: state.deviceSingle.data,
  isLoading: state.deviceSingle.isLoading,
});

export default connect(mapStateToProps)(EventChartSingle);
