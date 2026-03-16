import {
  CHATBOT_SEND_FAIL,
  CHATBOT_SEND_REQUEST,
  CHATBOT_SEND_SUCCESS
} from '../constants/chatbotConstants';

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

function is_project_related(question_text) {
  const normalized_question = question_text.toLowerCase();

  return project_keywords.some((keyword_item) =>
    normalized_question.includes(keyword_item)
  );
}

function extract_gemini_text(response_json) {
  const candidates = response_json.candidates || [];
  if (!candidates.length) {
    return 'No response from chatbot. Please try again.';
  }

  const parts = candidates[0].content?.parts || [];
  const text_part = parts.find((part_item) => part_item.text);

  return text_part?.text || 'No response from chatbot. Please try again.';
}

export const send_chat_message = (question_text) => async (dispatch) => {
  dispatch({ type: CHATBOT_SEND_REQUEST, payload: question_text });

  if (!is_project_related(question_text)) {
    dispatch({
      type: CHATBOT_SEND_SUCCESS,
      payload:
        'I can only answer questions related to this Car Wash & Detailing Services platform.'
    });
    return;
  }

  const gemini_api_key = process.env.REACT_APP_GEMINI_API_KEY;

  if (!gemini_api_key) {
    dispatch({
      type: CHATBOT_SEND_FAIL,
      payload:
        'Gemini API key is missing. Set REACT_APP_GEMINI_API_KEY in your environment.'
    });
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gemini_api_key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  'You are a support chatbot for a Car Wash & Detailing Services platform with three roles: Admin, Seller, and User. Only answer questions about this project domain: services, seller applications, orders, PayPal checkout, dashboard usage, and account actions. If question is out of scope, reply: I can only answer questions related to this Car Wash & Detailing Services platform.'
              }
            ]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: question_text }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to connect to Gemini API.');
    }

    const response_json = await response.json();
    const answer_text = extract_gemini_text(response_json);

    dispatch({ type: CHATBOT_SEND_SUCCESS, payload: answer_text });
  } catch (error) {
    dispatch({ type: CHATBOT_SEND_FAIL, payload: error.message });
  }
};
