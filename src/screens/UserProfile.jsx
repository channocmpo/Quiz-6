import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api_request } from '../utils/apiClient';

function UserProfile() {
  const user_signin_state = useSelector((state) => state.userSignin);
  const current_user = user_signin_state.userInfo;
  const [user_orders, set_user_orders] = useState([]);

  useEffect(() => {
    const load_orders = async () => {
      if (!current_user) {
        set_user_orders([]);
        return;
      }

      try {
        const orders = await api_request('/orders/history/', { method: 'GET' });
        set_user_orders(orders);
      } catch (_error) {
        set_user_orders([]);
      }
    };

    load_orders();
  }, [current_user]);

  if (!current_user) {
    return (
      <Container className="py-5 theme-page">
        <Alert variant="warning" className="mb-3">
          Please sign in first to access your profile.
        </Alert>
        <Button as={Link} to="/signin" variant="primary">
          Go to Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 theme-page">
      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm border-0 themed-card">
            <Card.Body className="p-4">
              <h1 className="h4 mb-3">User Profile</h1>
              <p className="mb-1">
                <strong>Name:</strong> {current_user.first_name} {current_user.last_name}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {current_user.email}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {current_user.phone_number}
              </p>
              <p className="mb-1">
                <strong>Location:</strong> {current_user.location}
              </p>
              <p className="mb-0">
                <strong>Role:</strong> {current_user.role}
              </p>

              <Button as={Link} to="/" variant="outline-primary" className="mt-4">
                Back to Services
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm border-0 themed-card">
            <Card.Body className="p-4">
              <h2 className="h5 mb-3">My Orders</h2>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Service</th>
                    <th>Price</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user_orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-muted text-center py-3">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                  {user_orders.map((order_item) => (
                    <tr key={order_item.id}>
                      <td>ORDER-{order_item.id}</td>
                      <td>{order_item.service_name}</td>
                      <td>${order_item.price_paid}</td>
                      <td>{order_item.paypal_transaction_id}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;
