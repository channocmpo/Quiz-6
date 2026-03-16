import { useDispatch, useSelector } from 'react-redux';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { signout } from '../actions/userActions';

function AppNavbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user_signin_state = useSelector((state) => state.userSignin);
  const current_user = user_signin_state.userInfo;

  const hide_on_auth_pages =
    location.pathname === '/signin' || location.pathname === '/signup';

  if (!current_user || hide_on_auth_pages) {
    return null;
  }

  const is_admin = current_user.role === 'Admin';
  const is_seller = current_user.role === 'Seller';

  return (
    <Navbar expand="lg" className="app-navbar" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Car Wash Hub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/apply-seller">
              Apply Seller
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
            {is_seller && (
              <Nav.Link as={Link} to="/seller-dashboard">
                Seller Dashboard
              </Nav.Link>
            )}
            {is_admin && (
              <Nav.Link as={Link} to="/users">
                Users
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            <Navbar.Text className="me-3 small">
              Signed in as {current_user.first_name}
            </Navbar.Text>
            <Nav.Link as="button" onClick={() => dispatch(signout())}>
              Sign Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
