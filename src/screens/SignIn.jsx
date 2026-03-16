import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signin } from '../actions/userActions';

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [feedback_message, set_feedback_message] = useState('');

  const user_signin_state = useSelector((state) => state.userSignin);
  const { loading, userInfo, error } = user_signin_state;

  const redirect_path = location.state?.from?.pathname || '/';

  const handle_submit = (event) => {
    event.preventDefault();

    if (!email.includes('@')) {
      set_feedback_message('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      set_feedback_message('Password must be at least 6 characters.');
      return;
    }

    set_feedback_message('');
    dispatch(signin(email.trim(), password));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect_path);
    }
  }, [navigate, redirect_path, userInfo]);

  const display_error_message = feedback_message || error;

  return (
    <Container fluid className="px-0">
      <Row className="g-0" style={{ minHeight: '100vh' }}>
        <Col
          lg={7}
          className="d-none d-lg-flex align-items-end"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/car%20was.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-white p-5">
            <h1 className="display-6 fw-bold mb-3">Car Wash & Detailing Services</h1>
            <p className="mb-0 fs-5">
              Book trusted detailing services, connect with sellers, and manage your vehicle care in one platform.
            </p>
          </div>
        </Col>

        <Col lg={5} className="d-flex align-items-center bg-light">
          <Container className="py-5">
            <Row className="justify-content-center">
              <Col md={9} lg={10} xl={9}>
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <p className="text-uppercase text-primary fw-semibold small mb-2">
                      Welcome to
                    </p>
                    <h1 className="h4 mb-2">Sign In</h1>
                    <p className="text-muted mb-4">
                      Car Wash & Detailing Services Platform
                    </p>

                    {display_error_message && (
                      <Alert variant="danger" className="mb-3">
                        {display_error_message}
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
                          minLength={6}
                          required
                        />
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button type="submit" variant="primary" disabled={loading}>
                          {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <Button as={Link} to="/signup" variant="outline-secondary">
                          Go to Register
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
        </Col>
      </Row>
    </Container>
  );
}

export default SignIn;
