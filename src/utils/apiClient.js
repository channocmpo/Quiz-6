const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

const TOKEN_KEY = 'platform_tokens';
const USER_KEY = 'platform_user_info';

export function get_api_base_url() {
  return API_BASE_URL;
}

export function build_media_url(image_path) {
  if (!image_path) {
    return '';
  }

  if (image_path.startsWith('http://') || image_path.startsWith('https://')) {
    return image_path;
  }

  return `${BACKEND_BASE_URL}${image_path}`;
}

export function get_tokens() {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (_error) {
    return null;
  }
}

export function save_tokens(tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function clear_tokens() {
  localStorage.removeItem(TOKEN_KEY);
}

export function get_user_info() {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (_error) {
    return null;
  }
}

export function save_user_info(user_info) {
  localStorage.setItem(USER_KEY, JSON.stringify(user_info));
}

export function clear_user_info() {
  localStorage.removeItem(USER_KEY);
}

export async function api_request(endpoint, options = {}, needs_auth = true) {
  const headers = {
    ...(options.headers || {}),
  };

  const is_form_data = options.body instanceof FormData;
  if (!is_form_data) {
    headers['Content-Type'] = 'application/json';
  }

  if (needs_auth) {
    const tokens = get_tokens();
    if (tokens?.access) {
      headers.Authorization = `Bearer ${tokens.access}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = {};
  try {
    data = await response.json();
  } catch (_error) {
    data = {};
  }

  if (!response.ok) {
    const error_message = data.detail || data.error || 'Request failed.';
    throw new Error(error_message);
  }

  return data;
}
