import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { create_seller_application, get_current_user } from '../utils/userStorage';

function ApplySeller() {
  const current_user = get_current_user();
  const [application_message, set_application_message] = useState('');
  const [feedback_message, set_feedback_message] = useState('');

  const handle_submit = (event) => {
    event.preventDefault();

    if (!current_user) {
      set_feedback_message('Please sign in first before applying as a seller.');
      return;
    }

    const application_result = create_seller_application({
      user_id: current_user.id,
      email: current_user.email,
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      application_message
    });

    if (!application_result.success) {
      set_feedback_message(application_result.message);
      return;
    }

    set_application_message('');
    set_feedback_message('Application submitted. Waiting for admin approval.');
  };

  return (
    <Container className="py-5 theme-page">
      <Row className="justify-content-center">
        <Col lg={7}>
          <Card className="shadow-sm border-0 themed-card">
            <Card.Body className="p-4">
              <h1 className="h4 mb-3">Apply as Seller</h1>
              <p className="text-muted mb-4">
                Any user can apply to become a seller. Applications are reviewed by the admin.
              </p>

              {feedback_message && (
                <Alert variant="info" className="mb-4">
                  {feedback_message}
                </Alert>
              )}

              <Form onSubmit={handle_submit}>
                <Form.Group className="mb-4" controlId="application_message">
                  <Form.Label>Application Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={application_message}
                    onChange={(event) => set_application_message(event.target.value)}
                    placeholder="Tell the admin why you want to become a seller"
                    required
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary">
                    Submit Application
                  </Button>
                  <Button as={Link} to="/" variant="outline-secondary">
                    Back to Services
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

export default ApplySeller;
