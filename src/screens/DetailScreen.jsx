import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { api_request, build_media_url } from '../utils/apiClient';

function DetailScreen() {
  const { id } = useParams();
  const user_signin_state = useSelector((state) => state.userSignin);
  const current_user = user_signin_state.userInfo;
  const [feedback_message, set_feedback_message] = useState('');
  const [selected_service, set_selected_service] = useState(null);

  useEffect(() => {
    const load_service_detail = async () => {
      try {
        const service_detail = await api_request(`/services/${id}/`, { method: 'GET' }, true);
        set_selected_service(service_detail);
      } catch (_error) {
        set_selected_service(null);
      }
    };

    load_service_detail();
  }, [id]);

  const seller_merchant_id = selected_service?.seller_merchant_id || '';

  const handle_avail_service = async () => {
    if (!current_user) {
      set_feedback_message('Please sign in first to avail this service.');
      return;
    }

    if (current_user.role !== 'User') {
      set_feedback_message('Only regular users can place service orders from this page.');
      return;
    }

    if (!seller_merchant_id) {
      set_feedback_message('Seller merchant account is not configured yet.');
      return;
    }

    const numeric_price = Number(
      String(selected_service.price).replace(/[^0-9.]/g, '')
    );

    const pending_transaction_id = `PENDING-${Date.now()}`;

    try {
      await api_request('/orders/create/', {
        method: 'POST',
        body: JSON.stringify({
          service: selected_service.id,
          paypal_transaction_id: pending_transaction_id,
          price_paid: numeric_price,
        }),
      });
    } catch (error) {
      set_feedback_message(error.message);
      return;
    }

    const paypal_url = new URL('https://www.paypal.com/cgi-bin/webscr');
    paypal_url.searchParams.set('cmd', '_xclick');
    paypal_url.searchParams.set('business', seller_merchant_id);
    paypal_url.searchParams.set('item_name', selected_service.service_name);
    paypal_url.searchParams.set('amount', String(numeric_price));
    paypal_url.searchParams.set('currency_code', 'USD');
    paypal_url.searchParams.set('invoice', pending_transaction_id);
    paypal_url.searchParams.set('custom', `platform_order_${pending_transaction_id}`);

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
              src={build_media_url(selected_service.sample_image)}
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
                {seller_merchant_id
                  ? seller_merchant_id
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
