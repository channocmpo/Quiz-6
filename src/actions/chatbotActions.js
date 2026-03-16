import {
  CHATBOT_SEND_FAIL,
  CHATBOT_SEND_REQUEST,
  CHATBOT_SEND_SUCCESS
} from '../constants/chatbotConstants';
import { api_request } from '../utils/apiClient';

const project_keywords = [
  'car wash',
  'detailing',
  'service',
  'seller',
  'admin',
  'user',
  'application',
  'paypal',
  'order',
  'merchant',
  'dashboard',
  'profile',
  'booking',
  'payment',
  'cleaning',
  'coating'
];

const greeting_keywords = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];

function is_greeting(question_text) {
  const normalized_question = question_text.toLowerCase().trim();
  return greeting_keywords.some((keyword_item) => normalized_question === keyword_item);
}

function is_project_related(question_text) {
  const normalized_question = question_text.toLowerCase();

  return project_keywords.some((keyword_item) =>
    normalized_question.includes(keyword_item)
  );
}

export const send_chat_message = (question_text) => async (dispatch) => {
  dispatch({ type: CHATBOT_SEND_REQUEST, payload: question_text });

  if (is_greeting(question_text)) {
    dispatch({
      type: CHATBOT_SEND_SUCCESS,
      payload:
        'Hello! I can help with this Car Wash & Detailing Services platform — ask me about services, sellers, orders, PayPal, or account actions.'
    });
    return;
  }

  if (!is_project_related(question_text)) {
    dispatch({
      type: CHATBOT_SEND_SUCCESS,
      payload:
        'I can only answer questions related to this Car Wash & Detailing Services platform.'
    });
    return;
  }

  try {
    const response_json = await api_request('/chat/ask/', {
      method: 'POST',
      body: JSON.stringify({ question: question_text }),
    });
    const answer_text = response_json.answer || 'No response from chatbot.';

    dispatch({ type: CHATBOT_SEND_SUCCESS, payload: answer_text });
  } catch (error) {
    dispatch({ type: CHATBOT_SEND_FAIL, payload: error.message });
  }
};
