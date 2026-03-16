import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Modal,
  Tab,
  Table,
  Tabs
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  api_request,
} from '../utils/apiClient';

function UserScreen() {
  const user_signin_state = useSelector((state) => state.userSignin);
  const current_user = user_signin_state.userInfo;
  const [users, set_users] = useState([]);
  const [applications, set_applications] = useState([]);
  const [edit_user_id, set_edit_user_id] = useState(null);
  const [edit_form, set_edit_form] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [approve_modal_state, set_approve_modal_state] = useState({
    show: false,
    application_id: null,
    merchant_id: ''
  });
  const [decline_modal_state, set_decline_modal_state] = useState({
    show: false,
    application_id: null,
    decline_reason: ''
  });

  const is_admin = useMemo(
    () => current_user && current_user.role === 'Admin',
    [current_user]
  );

  useEffect(() => {
    const load_admin_data = async () => {
      try {
        const users_list = await api_request('/users/admin/users/', { method: 'GET' });
        set_users(users_list);
      } catch (_error) {
        set_users([]);
      }

      try {
        const app_list = await api_request('/applications/list/', { method: 'GET' });
        set_applications(app_list);
      } catch (_error) {
        set_applications([]);
      }
    };

    if (is_admin) {
      load_admin_data();
    }
  }, [is_admin]);

  const start_edit = (user_item) => {
    set_edit_user_id(user_item.id);
    set_edit_form({
      first_name: user_item.first_name,
      last_name: user_item.last_name,
      email: user_item.email
    });
  };

  const cancel_edit = () => {
    set_edit_user_id(null);
    set_edit_form({ first_name: '', last_name: '', email: '' });
  };

  const save_edit = async (user_id) => {
    const updated_users = users.map((user_item) => {
      if (user_item.id !== user_id) {
        return user_item;
      }

      return {
        ...user_item,
        first_name: edit_form.first_name,
        last_name: edit_form.last_name,
        email: edit_form.email
      };
    });

    set_users(updated_users);
    cancel_edit();
  };

  const delete_user = (user_id) => {
    const updated_users = users.filter((user_item) => user_item.id !== user_id);
    set_users(updated_users);
  };

  const open_approve_modal = (application_id) => {
    set_approve_modal_state({
      show: true,
      application_id,
      merchant_id: ''
    });
  };

  const close_approve_modal = () => {
    set_approve_modal_state({
      show: false,
      application_id: null,
      merchant_id: ''
    });
  };

  const open_decline_modal = (application_id) => {
    set_decline_modal_state({
      show: true,
      application_id,
      decline_reason: ''
    });
  };

  const close_decline_modal = () => {
    set_decline_modal_state({
      show: false,
      application_id: null,
      decline_reason: ''
    });
  };

  const handle_approve = async () => {
    if (!approve_modal_state.merchant_id.trim()) {
      return;
    }

    try {
      await api_request(`/applications/${approve_modal_state.application_id}/approve/`, {
        method: 'POST',
        body: JSON.stringify({ merchant_id: approve_modal_state.merchant_id.trim() }),
      });
      const users_list = await api_request('/users/admin/users/', { method: 'GET' });
      const app_list = await api_request('/applications/list/', { method: 'GET' });
      set_users(users_list);
      set_applications(app_list);
      close_approve_modal();
    } catch (_error) {}
  };

  const handle_decline = async () => {
    if (!decline_modal_state.decline_reason.trim()) {
      return;
    }

    try {
      await api_request(`/applications/${decline_modal_state.application_id}/decline/`, {
        method: 'POST',
        body: JSON.stringify({ decline_reason: decline_modal_state.decline_reason.trim() }),
      });
      const app_list = await api_request('/applications/list/', { method: 'GET' });
      set_applications(app_list);
      close_decline_modal();
    } catch (_error) {}
  };

  if (!is_admin) {
    return (
      <Container className="py-5 theme-page">
        <Alert variant="danger" className="mb-3">
          This page is accessible by Admin only.
        </Alert>
        <Button as={Link} to="/" variant="primary">
          Back to Services
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 theme-page">
      <Card className="shadow-sm border-0 themed-card">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h4 mb-0">User Management</h1>
            <Button as={Link} to="/" variant="outline-secondary" size="sm">
              Back
            </Button>
          </div>

          <Tabs defaultActiveKey="users" className="mb-3">
            <Tab eventKey="users" title="All Users">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user_item) => {
                    const is_editing = edit_user_id === user_item.id;

                    return (
                      <tr key={user_item.id}>
                        <td>
                          {is_editing ? (
                            <Form.Control
                              size="sm"
                              value={edit_form.first_name}
                              onChange={(event) =>
                                set_edit_form({
                                  ...edit_form,
                                  first_name: event.target.value
                                })
                              }
                            />
                          ) : (
                            user_item.first_name
                          )}
                        </td>
                        <td>
                          {is_editing ? (
                            <Form.Control
                              size="sm"
                              value={edit_form.last_name}
                              onChange={(event) =>
                                set_edit_form({
                                  ...edit_form,
                                  last_name: event.target.value
                                })
                              }
                            />
                          ) : (
                            user_item.last_name
                          )}
                        </td>
                        <td>
                          {is_editing ? (
                            <Form.Control
                              size="sm"
                              type="email"
                              value={edit_form.email}
                              onChange={(event) =>
                                set_edit_form({
                                  ...edit_form,
                                  email: event.target.value
                                })
                              }
                            />
                          ) : (
                            user_item.email
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {is_editing ? (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => save_edit(user_item.id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={cancel_edit}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => start_edit(user_item)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => delete_user(user_item.id)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="applications" title="Seller Applications">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application_item) => {
                    const is_pending = application_item.status === 'Pending';

                    return (
                      <tr key={application_item.id}>
                        <td>{application_item.first_name || '-'}</td>
                        <td>{application_item.last_name || '-'}</td>
                        <td>{application_item.user_email}</td>
                        <td>{application_item.status}</td>
                        <td>
                          {is_pending ? (
                            <div className="d-flex gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => open_approve_modal(application_item.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => open_decline_modal(application_item.id)}
                              >
                                Decline
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted small">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <Modal show={approve_modal_state.show} onHide={close_approve_modal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Approve Seller Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="merchant_id">
            <Form.Label>Assign Merchant ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter seller merchant-id"
              value={approve_modal_state.merchant_id}
              onChange={(event) =>
                set_approve_modal_state({
                  ...approve_modal_state,
                  merchant_id: event.target.value
                })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={close_approve_modal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handle_approve}>
            Confirm Approve
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={decline_modal_state.show} onHide={close_decline_modal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Decline Seller Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="decline_reason">
            <Form.Label>Reason for Decline</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Input reason for declining application"
              value={decline_modal_state.decline_reason}
              onChange={(event) =>
                set_decline_modal_state({
                  ...decline_modal_state,
                  decline_reason: event.target.value
                })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={close_decline_modal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handle_decline}>
            Confirm Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserScreen;
