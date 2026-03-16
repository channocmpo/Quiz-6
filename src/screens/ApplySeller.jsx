import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api_request } from '../utils/apiClient';

function ApplySeller() {
  const [application_message, set_application_message] = useState('');
  const [feedback_message, set_feedback_message] = useState('');

  const handle_submit = async (event) => {
    event.preventDefault();

    if (!application_message.trim()) {
      set_feedback_message('Please provide your application message.');
      return;
    }

    try {
      await api_request('/applications/apply/', {
        method: 'POST',
        body: JSON.stringify({ application_message }),
      });

      set_application_message('');
      set_feedback_message('Application submitted. Waiting for admin approval.');
    } catch (error) {
      set_feedback_message(error.message);
    }
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
