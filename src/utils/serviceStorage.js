import services_data from '../data/servicesData';

const SERVICES_STORAGE_KEY = 'platform_services';

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

export function get_services() {
  const stored_services = read_json(SERVICES_STORAGE_KEY, null);

  if (stored_services && stored_services.length) {
    return stored_services;
  }

  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services_data));
  return services_data;
}

export function save_services(services) {
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
}

export function create_service(service_payload) {
  const services = get_services();

  const created_service = {
    id: Date.now(),
    rating: 5.0,
    ...service_payload
  };

  save_services([...services, created_service]);
  return created_service;
}

export function update_service(service_id, service_payload) {
  const services = get_services();

  const updated_services = services.map((service_item) => {
    if (service_item.id !== service_id) {
      return service_item;
    }

    return {
      ...service_item,
      ...service_payload
    };
  });

  save_services(updated_services);
}

export function delete_service(service_id) {
  const services = get_services();
  const updated_services = services.filter(
    (service_item) => service_item.id !== service_id
  );

  save_services(updated_services);
}

export function get_service_by_id(service_id) {
  const services = get_services();
  return services.find((service_item) => service_item.id === service_id) || null;
}
