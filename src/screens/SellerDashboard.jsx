import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api_request, build_media_url } from '../utils/apiClient';

function SellerDashboard() {
  const user_signin_state = useSelector((state) => state.userSignin);
  const current_user = user_signin_state.userInfo;
  const is_seller =
    current_user && (current_user.role === 'Seller' || current_user.role === 'Admin');

  const [services, set_services] = useState([]);
  const [form_data, set_form_data] = useState({
    service_name: '',
    description: '',
    price: '',
    duration_of_service: '',
    sample_image: null
  });
  const [edit_service_id, set_edit_service_id] = useState(null);

  useEffect(() => {
    const load_manage_services = async () => {
      try {
        const list_data = await api_request('/services/manage/', { method: 'GET' });
        set_services(list_data);
      } catch (_error) {
        set_services([]);
      }
    };

    if (is_seller) {
      load_manage_services();
    }
  }, [is_seller]);

  const seller_services = useMemo(
    () =>
      services.filter(
        (service_item) =>
          current_user &&
          (current_user.role === 'Admin' ||
            service_item.seller_user_id === current_user.id)
      ),
    [services, current_user]
  );

  if (!is_seller) {
    return (
      <Container className="py-5 theme-page">
        <Alert variant="danger" className="mb-3">
          This page is accessible by approved Sellers only.
        </Alert>
        <Button as={Link} to="/" variant="primary">
          Back to Services
        </Button>
      </Container>
    );
  }

  const handle_change = (event) => {
    const { name, value, files } = event.target;
    set_form_data((previous_data) => ({
      ...previous_data,
      [name]: name === 'sample_image' ? files[0] : value
    }));
  };

  const reset_form = () => {
    set_form_data({
      service_name: '',
      description: '',
      price: '',
      duration_of_service: '',
      sample_image: null
    });
    set_edit_service_id(null);
  };

  const handle_submit = async (event) => {
    event.preventDefault();

    const service_payload = new FormData();
    service_payload.append('service_name', form_data.service_name);
    service_payload.append('description', form_data.description);
    service_payload.append('price', form_data.price);
    service_payload.append('duration_of_service', form_data.duration_of_service);
    if (form_data.sample_image) {
      service_payload.append('sample_image', form_data.sample_image);
    }

    try {
      if (edit_service_id) {
        await api_request(`/services/manage/${edit_service_id}/`, {
          method: 'PATCH',
          body: service_payload,
        });
      } else {
        await api_request('/services/manage/', {
          method: 'POST',
          body: service_payload,
        });
      }

      const list_data = await api_request('/services/manage/', { method: 'GET' });
      set_services(list_data);
      reset_form();
    } catch (_error) {}
  };

  const start_edit = (service_item) => {
    set_edit_service_id(service_item.id);
    set_form_data({
      service_name: service_item.service_name,
      description: service_item.description,
      price: service_item.price,
      duration_of_service: service_item.duration_of_service,
      sample_image: null
    });
  };

  const handle_delete = async (service_id) => {
    try {
      await api_request(`/services/manage/${service_id}/`, { method: 'DELETE' });
      const list_data = await api_request('/services/manage/', { method: 'GET' });
      set_services(list_data);
    } catch (_error) {}
  };

  return (
    <Container className="py-5 theme-page">
      <Row className="g-4">
        <Col lg={5}>
          <Card className="shadow-sm border-0 themed-card">
            <Card.Body className="p-4">
              <h1 className="h4 mb-3">Seller Dashboard</h1>
              <p className="text-muted mb-4">Add or update your service listings.</p>

              <Form onSubmit={handle_submit}>
                <Form.Group className="mb-3" controlId="service_name">
                  <Form.Label>Service Name</Form.Label>
                  <Form.Control
                    name="service_name"
                    value={form_data.service_name}
                    onChange={handle_change}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={form_data.description}
                    onChange={handle_change}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="price">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        name="price"
                        value={form_data.price}
                        onChange={handle_change}
                        placeholder="$0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="duration_of_service">
                      <Form.Label>Duration</Form.Label>
                      <Form.Control
                        name="duration_of_service"
                        value={form_data.duration_of_service}
                        onChange={handle_change}
                        placeholder="60 minutes"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="sample_image">
                  <Form.Label>Image File</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="sample_image"
                    onChange={handle_change}
                    required={!edit_service_id}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="success">
                    {edit_service_id ? 'Update Service' : 'Add Service'}
                  </Button>
                  {edit_service_id && (
                    <Button variant="outline-secondary" onClick={reset_form}>
                      Cancel Edit
                    </Button>
                  )}
                  <Button as={Link} to="/" variant="outline-primary">
                    Back
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="shadow-sm border-0 themed-card">
            <Card.Body className="p-4">
              <h2 className="h5 mb-3">Manage Existing Services</h2>

              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seller_services.map((service_item) => (
                    <tr key={service_item.id}>
                      <td>{service_item.service_name}</td>
                      <td>{service_item.price}</td>
                      <td>{service_item.duration_of_service}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => start_edit(service_item)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handle_delete(service_item.id)}
                          >
                            Delete
                          </Button>
                        </div>
                        <img
                          src={build_media_url(service_item.sample_image)}
                          alt={service_item.service_name}
                          style={{ width: '64px', height: '44px', objectFit: 'cover', marginTop: '6px', borderRadius: '6px' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SellerDashboard;
