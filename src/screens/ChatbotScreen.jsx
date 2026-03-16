import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { send_chat_message } from '../actions/chatbotActions';

function ChatbotScreen() {
  const dispatch = useDispatch();
  const [question_text, set_question_text] = useState('');

  const chatbot_state = useSelector((state) => state.chatbotState);
  const { loading, messages } = chatbot_state;

  const handle_submit = (event) => {
    event.preventDefault();

    const trimmed_question = question_text.trim();

    if (!trimmed_question) {
      return;
    }

    dispatch(send_chat_message(trimmed_question));
    set_question_text('');
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h4 mb-0">AI Support Chatbot</h1>
            <Button as={Link} to="/" variant="outline-secondary" size="sm">
              Back
            </Button>
          </div>

          <Alert variant="info" className="mb-3">
            This chatbot only answers questions related to this Car Wash & Detailing Services project.
          </Alert>

          <div className="border rounded p-3 mb-3" style={{ minHeight: '280px' }}>
            {messages.length === 0 && (
              <p className="text-muted mb-0">
                Ask about services, seller applications, PayPal payment flow, orders, and dashboard usage.
              </p>
            )}

            {messages.map((message_item, index) => (
              <div key={`${message_item.role}-${index}`} className="mb-3">
                <p className="mb-1 small text-muted">
                  {message_item.role === 'user' ? 'You' : 'AI Bot'}
                </p>
                <div
                  className={`p-2 rounded ${
                    message_item.role === 'user' ? 'bg-primary text-white' : 'bg-light'
                  }`}
                >
                  {message_item.text}
                </div>
              </div>
            ))}
          </div>

          <Form onSubmit={handle_submit}>
            <Form.Group className="mb-3" controlId="chat_question">
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Type your question here"
                value={question_text}
                onChange={(event) => set_question_text(event.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Thinking...' : 'Ask Gemini'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ChatbotScreen;
