import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import services_data from '../data/servicesData';

function HomeScreen() {
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col md={8}>
          <h1 className="h3 mb-1">Available Expert Services</h1>
          <p className="text-muted mb-0">
            Browse useful services from trusted experts.
          </p>
        </Col>
        <Col
          md={4}
          className="d-flex align-items-start justify-content-md-end mt-3 mt-md-0"
        >
          <div className="d-flex gap-2">
            <Link to="/signin" className="btn btn-primary btn-sm">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-outline-primary btn-sm">
              Sign Up
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {services_data.map((service_item) => (
          <Col key={service_item.id} md={6} lg={4}>
            <Link
              to={`/services/${service_item.id}`}
              className="text-decoration-none"
            >
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={service_item.sample_image}
                  alt={service_item.service_name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-5 text-dark">
                    {service_item.service_name}
                  </Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {service_item.description}
                  </Card.Text>
                  <div>
                    <Badge bg="primary">Rating: {service_item.rating}</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomeScreen;
