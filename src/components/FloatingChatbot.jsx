import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Form } from 'react-bootstrap';
import { send_chat_message } from '../actions/chatbotActions';

function FloatingChatbot() {
  const dispatch = useDispatch();
  const user_signin_state = useSelector((state) => state.userSignin);
  const chatbot_state = useSelector((state) => state.chatbotState);

  const { userInfo } = user_signin_state;
  const { loading, messages } = chatbot_state;

  const [is_open, set_is_open] = useState(false);
  const [question_text, set_question_text] = useState('');

  if (!userInfo) {
    return null;
  }

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
    <div style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: 1050 }}>
      {is_open && (
        <Card
          className="shadow border-0 mb-2 floating-chat-window"
          style={{ width: '340px' }}
        >
          <Card.Header className="d-flex justify-content-between align-items-center">
            <strong className="small">AI Chatbot</strong>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => set_is_open(false)}
            >
              Close
            </Button>
          </Card.Header>
          <Card.Body>
            <div
              className="border rounded p-2 mb-3"
              style={{ maxHeight: '260px', overflowY: 'auto', borderColor: 'rgba(255,255,255,0.18)' }}
            >
              {messages.length === 0 && (
                <p className="text-muted small mb-0">
                  Ask about services, seller applications, orders, and PayPal flow.
                </p>
              )}

              {messages.map((message_item, index) => (
                <div key={`${message_item.role}-${index}`} className="mb-2">
                  <div className="small text-muted mb-1">
                    {message_item.role === 'user' ? 'You' : 'AI Bot'}
                  </div>
                  <div
                    className={`p-2 rounded small ${
                      message_item.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-dark text-white'
                    }`}
                  >
                    {message_item.text}
                  </div>
                </div>
              ))}
            </div>

            <Form onSubmit={handle_submit}>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Type your question"
                value={question_text}
                onChange={(event) => set_question_text(event.target.value)}
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="mt-2"
                disabled={loading}
              >
                {loading ? 'Thinking...' : 'Send'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {!is_open && (
        <Button
          variant="info"
          className="text-white floating-chat-trigger"
          onClick={() => set_is_open(true)}
        >
          AI Chatbot
        </Button>
      )}
    </div>
  );
}

export default FloatingChatbot;
