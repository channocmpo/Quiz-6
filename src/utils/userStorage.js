import users_data from '../data/usersData';

const USERS_STORAGE_KEY = 'platform_users';
const CURRENT_USER_STORAGE_KEY = 'platform_current_user';
const SELLER_APPLICATION_STORAGE_KEY = 'platform_seller_applications';

function read_json(key, fallback_value) {
  const stored_value = localStorage.getItem(key);

  if (!stored_value) {
    return fallback_value;
  }

  try {
    return JSON.parse(stored_value);
  } catch (_error) {
    return fallback_value;
  }
}

export function get_users() {
  const users = read_json(USERS_STORAGE_KEY, null);

  if (users && users.length) {
    return users;
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users_data));
  return users_data;
}

export function save_users(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function create_user(new_user_payload) {
  const users = get_users();
  const is_email_taken = users.some(
    (existing_user) =>
      existing_user.email.toLowerCase() === new_user_payload.email.toLowerCase()
  );

  if (is_email_taken) {
    return { success: false, message: 'Email already exists.' };
  }

  const created_user = {
    id: Date.now(),
    ...new_user_payload,
    role: 'User'
  };

  const updated_users = [...users, created_user];
  save_users(updated_users);

  return { success: true, user: created_user };
}

export function authenticate_user(email, password) {
  const users = get_users();

  const matched_user = users.find(
    (user_item) =>
      user_item.email.toLowerCase() === email.toLowerCase() &&
      user_item.password === password
  );

  if (!matched_user) {
    return { success: false, message: 'Invalid email or password.' };
  }

  set_current_user(matched_user);
  return { success: true, user: matched_user };
}

export function get_current_user() {
  return read_json(CURRENT_USER_STORAGE_KEY, null);
}

export function set_current_user(user) {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
}

export function create_seller_application(application_payload) {
  const applications = read_json(SELLER_APPLICATION_STORAGE_KEY, []);

  const created_application = {
    id: Date.now(),
    status: 'Pending',
    submitted_at: new Date().toISOString(),
    ...application_payload
  };

  localStorage.setItem(
    SELLER_APPLICATION_STORAGE_KEY,
    JSON.stringify([...applications, created_application])
  );

  return created_application;
}
