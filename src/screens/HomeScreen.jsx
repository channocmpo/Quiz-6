import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import services_data from '../data/servicesData';

function HomeScreen() {
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-1">Available Expert Services</h1>
          <p className="text-muted mb-0">
            Browse useful services from trusted experts.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {services_data.map((service_item) => (
          <Col key={service_item.id} md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src={service_item.sample_image}
                alt={service_item.service_name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-5">{service_item.service_name}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  {service_item.description}
                </Card.Text>
                <div>
                  <Badge bg="primary">Rating: {service_item.rating}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomeScreen;
