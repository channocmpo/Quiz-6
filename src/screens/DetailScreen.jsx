import { useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { get_service_by_id } from '../utils/serviceStorage';
import { create_user_order, get_current_user, get_user_by_id } from '../utils/userStorage';

function DetailScreen() {
  const { id } = useParams();
  const current_user = get_current_user();
  const [feedback_message, set_feedback_message] = useState('');
  const selected_service = get_service_by_id(Number(id));

  const seller_user = selected_service
    ? get_user_by_id(selected_service.seller_user_id)
    : null;

  const handle_avail_service = () => {
    if (!current_user) {
      set_feedback_message('Please sign in first to avail this service.');
      return;
    }

    if (current_user.role !== 'User') {
      set_feedback_message('Only regular users can place service orders from this page.');
      return;
    }

    if (!seller_user || !seller_user.merchant_id) {
      set_feedback_message('Seller merchant account is not configured yet.');
      return;
    }

    const numeric_price = Number(
      String(selected_service.price).replace(/[^0-9.]/g, '')
    );

    const created_order = create_user_order({
      user_id: current_user.id,
      service_id: selected_service.id,
      service_name: selected_service.service_name,
      price: selected_service.price,
      seller_user_id: seller_user.id,
      seller_name: `${seller_user.first_name} ${seller_user.last_name}`,
      seller_merchant_id: seller_user.merchant_id,
      payment_status: 'Redirected to PayPal'
    });

    const paypal_url = new URL('https://www.paypal.com/cgi-bin/webscr');
    paypal_url.searchParams.set('cmd', '_xclick');
    paypal_url.searchParams.set('business', seller_user.merchant_id);
    paypal_url.searchParams.set('item_name', selected_service.service_name);
    paypal_url.searchParams.set('amount', String(numeric_price));
    paypal_url.searchParams.set('currency_code', 'USD');
    paypal_url.searchParams.set('invoice', `ORDER-${created_order.id}`);
    paypal_url.searchParams.set('custom', `platform_order_${created_order.id}`);

    window.open(paypal_url.toString(), '_blank', 'noopener,noreferrer');
    set_feedback_message(
      'Order created and redirected to PayPal. Check your profile for order history.'
    );
  };

  if (!selected_service) {
    return (
      <Container className="py-5 theme-page">
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
    <Container className="py-5 theme-page">
      <Row className="mb-4">
        <Col>
          <Button as={Link} to="/" variant="outline-primary" size="sm">
            Back to Services
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm border-0 themed-card">
            <Card.Img
              variant="top"
              src={selected_service.sample_image}
              alt={selected_service.service_name}
              style={{ height: '320px', objectFit: 'cover' }}
            />
            <Card.Body>
              {feedback_message && (
                <Alert variant="info" className="mb-3">
                  {feedback_message}
                </Alert>
              )}

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

              <p className="mb-4">
                <strong>Seller Merchant ID:</strong>{' '}
                {seller_user && seller_user.merchant_id
                  ? seller_user.merchant_id
                  : 'Not set'}
              </p>

              <Button variant="success" onClick={handle_avail_service}>
                Avail Service via PayPal
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DetailScreen;
