import users_data from '../data/usersData';

const USERS_STORAGE_KEY = 'platform_users';
const CURRENT_USER_STORAGE_KEY = 'platform_current_user';
const SELLER_APPLICATION_STORAGE_KEY = 'platform_seller_applications';
const USER_ORDERS_STORAGE_KEY = 'platform_user_orders';

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

export function get_user_by_id(user_id) {
  const users = get_users();
  return users.find((user_item) => user_item.id === user_id) || null;
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

export function clear_current_user() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export function create_seller_application(application_payload) {
  const applications = read_json(SELLER_APPLICATION_STORAGE_KEY, []);

  const has_active_application = applications.some(
    (application_item) =>
      application_item.user_id === application_payload.user_id &&
      application_item.status === 'Pending'
  );

  if (has_active_application) {
    return {
      success: false,
      message: 'You already have a pending seller application.'
    };
  }

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

  return { success: true, application: created_application };
}

export function get_seller_applications() {
  return read_json(SELLER_APPLICATION_STORAGE_KEY, []);
}

export function save_seller_applications(applications) {
  localStorage.setItem(
    SELLER_APPLICATION_STORAGE_KEY,
    JSON.stringify(applications)
  );
}

export function approve_seller_application(application_id, merchant_id) {
  const users = get_users();
  const applications = get_seller_applications();

  const updated_applications = applications.map((application_item) => {
    if (application_item.id !== application_id) {
      return application_item;
    }

    return {
      ...application_item,
      status: 'Approved',
      merchant_id,
      reviewed_at: new Date().toISOString()
    };
  });

  const target_application = updated_applications.find(
    (application_item) => application_item.id === application_id
  );

  const updated_users = users.map((user_item) => {
    if (user_item.id !== target_application.user_id) {
      return user_item;
    }

    return {
      ...user_item,
      role: 'Seller',
      merchant_id
    };
  });

  save_seller_applications(updated_applications);
  save_users(updated_users);

  const current_user = get_current_user();
  if (current_user && current_user.id === target_application.user_id) {
    const refreshed_user = updated_users.find(
      (user_item) => user_item.id === current_user.id
    );
    set_current_user(refreshed_user);
  }
}

export function decline_seller_application(application_id, decline_reason) {
  const applications = get_seller_applications();

  const updated_applications = applications.map((application_item) => {
    if (application_item.id !== application_id) {
      return application_item;
    }

    return {
      ...application_item,
      status: 'Declined',
      decline_reason,
      reviewed_at: new Date().toISOString()
    };
  });

  save_seller_applications(updated_applications);
}

export function create_user_order(order_payload) {
  const orders = read_json(USER_ORDERS_STORAGE_KEY, []);
  const created_order = {
    id: Date.now(),
    ordered_at: new Date().toISOString(),
    ...order_payload
  };

  localStorage.setItem(
    USER_ORDERS_STORAGE_KEY,
    JSON.stringify([...orders, created_order])
  );

  return created_order;
}

export function get_all_orders() {
  return read_json(USER_ORDERS_STORAGE_KEY, []);
}

export function get_orders_by_user(user_id) {
  const orders = get_all_orders();
  return orders.filter((order_item) => order_item.user_id === user_id);
}
