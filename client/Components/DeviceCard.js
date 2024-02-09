import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import axios from "axios"; // Make sure to install axios if not already installed

const DeviceCard = (props) => {
  const [lastEvent, setLastEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastEvent = async () => {
      try {
        const response = await axios.get(
          `/api/devices/${props.device.id}/last-event`
        );
        console.log("last event response.data", response.data);
        setLastEvent(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching last event:", error);
        setIsLoading(false);
      }
    };

    if (props.deviceCurrentValues.length === 0) {
      fetchLastEvent();
    }
  }, [props.deviceId, props.deviceCurrentValues.length]);

  return (
    <Link to={`/devices/${props.device.id}`} className="text-decoration-none">
      <Card
        className="h-100 bg-info text-dark p-2"
        title={`${props.device.model} | MAC: ${props.device.mac}`}
      >
        <Card.Title className="fw-bold">
          {props.device.deviceconfig.label}
        </Card.Title>
        <Card.Body
          className="text-center display-1 fw-bold my-3"
          style={{ minHeight: "125px" }}
        >
          {props.deviceCurrentValues.length > 0 &&
          typeof props.deviceCurrentValues[0]?.value === "string" ? (
            <div>{props.deviceCurrentValues[0].value.slice(0, -1)}&deg;</div>
          ) : isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="grow" role="status" className="mt-4">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            lastEvent &&
            typeof lastEvent.value === "string" && (
              <div>{lastEvent.value.slice(0, -1)}&deg;</div>
            )
          )}
        </Card.Body>
      </Card>
    </Link>
  );
};

const mapStateToProps = (state, ownProps) => ({
  device: state.deviceAll.data.find(
    (device) => device.id === ownProps.deviceId
  ),
  deviceCurrentValues: state.deviceCurrentValues.data.filter(
    (deviceCurrentValue) => deviceCurrentValue.deviceId === ownProps.deviceId
  ),
});

export default connect(mapStateToProps)(DeviceCard);
