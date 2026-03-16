import {
  CHATBOT_CLEAR_MESSAGES,
  CHATBOT_SEND_FAIL,
  CHATBOT_SEND_REQUEST,
  CHATBOT_SEND_SUCCESS
} from '../constants/chatbotConstants';

const initial_state = {
  loading: false,
  error: '',
  messages: []
};

export const chatbot_reducer = (state = initial_state, action) => {
  switch (action.type) {
    case CHATBOT_SEND_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
        messages: [
          ...state.messages,
          { role: 'user', text: action.payload }
        ]
      };
    case CHATBOT_SEND_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: [
          ...state.messages,
          { role: 'assistant', text: action.payload }
        ]
      };
    case CHATBOT_SEND_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        messages: [
          ...state.messages,
          { role: 'assistant', text: action.payload }
        ]
      };
    case CHATBOT_CLEAR_MESSAGES:
      return initial_state;
    default:
      return state;
  }
};
