import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { api_request } from '../utils/apiClient';

function SignUp() {
  const navigate = useNavigate();
  const [form_data, set_form_data] = useState({
    email: '',
    username: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    location: '',
    gender: '',
    password: '',
    confirm_password: ''
  });
  const [feedback_message, set_feedback_message] = useState('');

  const handle_change = (event) => {
    const { name, value } = event.target;
    set_form_data((previous_data) => ({
      ...previous_data,
      [name]: value
    }));
  };

  const handle_submit = async (event) => {
    event.preventDefault();

    if (!form_data.email.includes('@')) {
      set_feedback_message('Please enter a valid email address.');
      return;
    }

    if (!/^\d{10,15}$/.test(form_data.phone_number)) {
      set_feedback_message('Phone number must contain 10 to 15 digits only.');
      return;
    }

    if (form_data.password.length < 6) {
      set_feedback_message('Password must be at least 6 characters.');
      return;
    }

    if (form_data.password !== form_data.confirm_password) {
      set_feedback_message('Password and confirm password must match.');
      return;
    }

    set_feedback_message('');

    try {
      await api_request(
        '/users/register/',
        {
          method: 'POST',
          body: JSON.stringify({
            email: form_data.email,
            username: form_data.username,
            phone_number: form_data.phone_number,
            first_name: form_data.first_name,
            last_name: form_data.last_name,
            location: form_data.location,
            gender: form_data.gender,
            password: form_data.password,
            confirm_password: form_data.confirm_password,
          }),
        },
        false
      );

      navigate('/signin');
    } catch (error) {
      set_feedback_message(error.message);
    }
  };

  return (
    <Container fluid className="px-0">
      <Row className="g-0" style={{ minHeight: '100vh' }}>
        <Col
          lg={5}
          className="d-none d-lg-flex align-items-end"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/cup.avif')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-white p-5">
            <h2 className="h3 fw-bold mb-3">Join Car Wash & Detailing Services</h2>
            <p className="mb-0 fs-6">
              Create your account to book vehicle cleaning services and track your orders.
            </p>
          </div>
        </Col>

        <Col lg={7} className="bg-light d-flex align-items-center">
          <Container className="py-5">
            <Row className="justify-content-center">
              <Col xl={10}>
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h1 className="h4 mb-3">Create Account</h1>
                    <p className="text-muted mb-4">Register with the required details below.</p>

                    {feedback_message && (
                      <Alert variant="danger" className="mb-3">
                        {feedback_message}
                      </Alert>
                    )}

                    <Form onSubmit={handle_submit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter email"
                              value={form_data.email}
                              onChange={handle_change}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                              type="text"
                              name="username"
                              placeholder="Enter username"
                              value={form_data.username}
                              onChange={handle_change}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="phone_number">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone_number"
                              placeholder="Enter phone number"
                              value={form_data.phone_number}
                              onChange={handle_change}
                              pattern="\d{10,15}"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="location">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                              type="text"
                              name="location"
                              placeholder="Enter location"
                              value={form_data.location}
                              onChange={handle_change}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="first_name">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="first_name"
                              placeholder="Enter first name"
                              value={form_data.first_name}
                              onChange={handle_change}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="last_name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="last_name"
                              placeholder="Enter last name"
                              value={form_data.last_name}
                              onChange={handle_change}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                              required
                              name="gender"
                              value={form_data.gender}
                              onChange={handle_change}
                            >
                              <option value="" disabled>
                                Select gender
                              </option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer_not_to_say">Prefer not to say</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              placeholder="Enter password"
                              value={form_data.password}
                              onChange={handle_change}
                              minLength={6}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4" controlId="confirm_password">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="confirm_password"
                              placeholder="Confirm password"
                              value={form_data.confirm_password}
                              onChange={handle_change}
                              minLength={6}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Button as={Link} to="/signin" variant="outline-secondary">
                          Go to Sign In
                        </Button>
                        <Button type="submit" variant="primary">
                          Register
                        </Button>
                      </div>
                    </Form>
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

export default SignUp;
