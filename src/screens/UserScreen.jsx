import { useMemo, useState } from 'react';
import { Alert, Button, Card, Container, Form, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { get_current_user, get_users, save_users } from '../utils/userStorage';

function UserScreen() {
  const current_user = get_current_user();
  const [users, set_users] = useState(get_users());
  const [edit_user_id, set_edit_user_id] = useState(null);
  const [edit_form, set_edit_form] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const is_admin = useMemo(
    () => current_user && current_user.role === 'Admin',
    [current_user]
  );

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

  const save_edit = (user_id) => {
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
    save_users(updated_users);
    cancel_edit();
  };

  const delete_user = (user_id) => {
    const updated_users = users.filter((user_item) => user_item.id !== user_id);
    set_users(updated_users);
    save_users(updated_users);
  };

  if (!is_admin) {
    return (
      <Container className="py-5">
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
    <Container className="py-5">
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h4 mb-0">Users</h1>
            <Button as={Link} to="/" variant="outline-secondary" size="sm">
              Back
            </Button>
          </div>

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
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserScreen;
