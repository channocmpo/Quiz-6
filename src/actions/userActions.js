import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_SYNC_CURRENT
} from '../constants/userConstants';
import {
  authenticate_user,
  clear_current_user,
  get_current_user
} from '../utils/userStorage';

export const sync_current_user = () => (dispatch) => {
  dispatch({
    type: USER_SYNC_CURRENT,
    payload: get_current_user()
  });
};

export const signin = (email, password) => (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST });

  const sign_in_result = authenticate_user(email, password);

  if (!sign_in_result.success) {
    dispatch({ type: USER_SIGNIN_FAIL, payload: sign_in_result.message });
    return;
  }

  dispatch({ type: USER_SIGNIN_SUCCESS, payload: sign_in_result.user });
};

export const signout = () => (dispatch) => {
  clear_current_user();
  dispatch({ type: USER_SIGNOUT });
};
