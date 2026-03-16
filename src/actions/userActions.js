import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_SYNC_CURRENT
} from '../constants/userConstants';
import {
  api_request,
  clear_tokens,
  clear_user_info,
  get_tokens,
  get_user_info,
  save_tokens,
  save_user_info,
} from '../utils/apiClient';

export const sync_current_user = () => async (dispatch) => {
  const stored_user = get_user_info();
  const stored_tokens = get_tokens();

  if (!stored_user || !stored_tokens?.access) {
    dispatch({
      type: USER_SYNC_CURRENT,
      payload: null,
    });
    return;
  }

  try {
    const profile_data = await api_request('/users/profile/', { method: 'GET' }, true);
    save_user_info(profile_data);
    dispatch({
      type: USER_SYNC_CURRENT,
      payload: profile_data,
    });
  } catch (_error) {
    clear_tokens();
    clear_user_info();
    dispatch({
      type: USER_SYNC_CURRENT,
      payload: null,
    });
  }
};

export const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST });

  try {
    const login_data = await api_request(
      '/users/login/',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      false
    );

    save_tokens({
      access: login_data.access,
      refresh: login_data.refresh,
    });
    save_user_info(login_data.user);

    dispatch({ type: USER_SIGNIN_SUCCESS, payload: login_data.user });
  } catch (error) {
    const error_message =
      error.message === 'Failed to fetch'
        ? 'Cannot connect to backend. Start Django server at http://127.0.0.1:8000 and make sure CORS is enabled.'
        : error.message;
    dispatch({ type: USER_SIGNIN_FAIL, payload: error_message });
  }
};

export const signout = () => (dispatch) => {
  clear_tokens();
  clear_user_info();
  dispatch({ type: USER_SIGNOUT });
};
