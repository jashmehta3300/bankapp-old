import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useGetAtmsMutation } from "../slices/atmsApiSlice";
import { setAtms } from "../slices/atmSlice";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../index.css";

const AtmScreen = () => {
  const [location, setLocation] = useState("");
  const [finalLocation, setFinalLocation] = useState("");
  const [atmsList, setAtmsList] = useState([]);

  const dispatch = useDispatch();

  const [getAtmsList, { isLoading }] = useGetAtmsMutation();

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = async (e) => {
    setFinalLocation(location);
    e.preventDefault();

    try {
      const res = await getAtmsList().unwrap();
      dispatch(setAtms(res));
      setAtmsList(res);
      toast.success("You ATM list is here!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Col md={1} />
          <Col md={7}>
            <Form.Control
              type="text"
              placeholder="Enter enter a ZIP code, or an address, city, and state."
              value={location}
              onChange={handleLocationChange}
              className="py-3 px-2"
            />
          </Col>
          <Col md={2}>
            <Button
              variant="dark"
              type="submit"
              className="w-100 me-3 px-5 py-2"
            >
              <span style={{ fontSize: "2.5vh" }}>Search</span>
            </Button>
          </Col>
          <Col md={1} />
        </Form.Group>
      </Form>

      {atmsList.length > 0 ? (
        <div className="mt-5">
          <h5 className="mb-4 mt-5">Showing results for {finalLocation}:</h5>
          <Row>
            <Col md={6}>
              <div className="card-container">
                {atmsList.map((atm, index) => (
                  <Card
                    key={index}
                    className="mb-4"
                    style={{ height: "12.5vh" }}
                    onClick={() => setSelectedCard(atm)}
                  >
                    <Badge
                      bg="success"
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        fontSize: "15px",
                      }}
                    >
                      Open
                    </Badge>
                    <div className="flex-grow-1">
                      <Card.Body style={{ marginTop: "0" }}>
                        <Card.Title
                          style={{ fontSize: "2.5vh", marginTop: "0" }}
                        >
                          <strong>{atm.name}</strong>
                        </Card.Title>
                        <Card.Text>
                          {atm.address.street +
                            ", " +
                            atm.address.city +
                            ", " +
                            atm.address.state +
                            ", " +
                            atm.address.zip}
                        </Card.Text>
                      </Card.Body>
                    </div>
                  </Card>
                ))}
              </div>
            </Col>
            <Col md={6}>
              <div className="map-container">
                <MapContainer
                  center={[37.77528, -81.19197]}
                  zoom={17}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {atmsList.map((atm, index) => (
                    <Marker
                      key={index}
                      position={[
                        atm.coordinates.latitude,
                        atm.coordinates.longitude,
                      ]}
                    >
                      <Popup keepInView="true" autoPan="false">
                        {atm.name}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Col>
          </Row>
        </div>
      ) : null}
    </Container>
  );
};

export default AtmScreen;