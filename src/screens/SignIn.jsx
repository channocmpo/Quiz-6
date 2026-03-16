import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authenticate_user } from '../utils/userStorage';

function SignIn() {
  const navigate = useNavigate();
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [feedback_message, set_feedback_message] = useState('');

  const handle_submit = (event) => {
    event.preventDefault();

    const sign_in_result = authenticate_user(email, password);

    if (!sign_in_result.success) {
      set_feedback_message(sign_in_result.message);
      return;
    }

    navigate('/');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h1 className="h4 mb-3">Sign In</h1>
              <p className="text-muted mb-4">Use your email and password to continue.</p>

              {feedback_message && (
                <Alert variant="danger" className="mb-3">
                  {feedback_message}
                </Alert>
              )}

              <Form onSubmit={handle_submit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => set_email(event.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => set_password(event.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary">
                    Sign In
                  </Button>
                  <Button as={Link} to="/" variant="outline-secondary">
                    Back to Services
                  </Button>
                </div>
              </Form>

              <p className="mt-4 mb-0 text-muted">
                New here? <Link to="/signup">Create an account</Link>
              </p>
              <p className="mt-2 mb-0 text-muted small">
                Demo admin login: admin@platform.com / admin123
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignIn;
