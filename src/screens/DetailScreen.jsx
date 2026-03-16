import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import services_data from '../data/servicesData';

function DetailScreen() {
  const { id } = useParams();
  const selected_service = services_data.find(
    (service_item) => service_item.id === Number(id)
  );

  if (!selected_service) {
    return (
      <Container className="py-5">
        <h1 className="h4 mb-3">Service Not Found</h1>
        <p className="text-muted mb-4">
          The selected service does not exist in the current list.
        </p>
        <Button as={Link} to="/" variant="primary">
          Back to Services
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <Button as={Link} to="/" variant="outline-primary" size="sm">
            Back to Services
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm border-0">
            <Card.Img
              variant="top"
              src={selected_service.sample_image}
              alt={selected_service.service_name}
              style={{ height: '320px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title className="h4 mb-3">
                {selected_service.service_name}
              </Card.Title>

              <Card.Text className="text-muted mb-4">
                {selected_service.description}
              </Card.Text>

              <div className="d-flex flex-wrap gap-2 mb-3">
                <Badge bg="primary">Rating: {selected_service.rating}</Badge>
                <Badge bg="success">Price: {selected_service.price}</Badge>
                <Badge bg="info" text="dark">
                  Duration: {selected_service.duration_of_service}
                </Badge>
              </div>

              <p className="mb-0">
                <strong>Detail Specialist:</strong> {selected_service.name_of_the_expert}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DetailScreen;
