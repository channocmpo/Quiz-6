import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { create_user } from '../utils/userStorage';

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

  const handle_submit = (event) => {
    event.preventDefault();

    if (form_data.password !== form_data.confirm_password) {
      set_feedback_message('Password and confirm password must match.');
      return;
    }

    const register_result = create_user({
      email: form_data.email,
      username: form_data.username,
      phone_number: form_data.phone_number,
      first_name: form_data.first_name,
      last_name: form_data.last_name,
      location: form_data.location,
      gender: form_data.gender,
      password: form_data.password
    });

    if (!register_result.success) {
      set_feedback_message(register_result.message);
      return;
    }

    navigate('/signin');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
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
  );
}

export default SignUp;
