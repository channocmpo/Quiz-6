import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { chatbot_reducer } from './reducers/chatbotReducers';
import { user_signin_reducer } from './reducers/userReducers';
import { get_current_user } from './utils/userStorage';

const initial_state = {
  userSignin: {
    userInfo: get_current_user()
  }
};

const reducer = combineReducers({
  userSignin: user_signin_reducer,
  chatbotState: chatbot_reducer
});

const store = createStore(reducer, initial_state, applyMiddleware(thunk));

export default store;
