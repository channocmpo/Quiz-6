import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { signout } from '../actions/userActions';
import { api_request, build_media_url } from '../utils/apiClient';

function HomeScreen() {
  const dispatch = useDispatch();
  const user_signin_state = useSelector((state) => state.userSignin);
  const current_user = user_signin_state.userInfo;
  const is_admin = current_user && current_user.role === 'Admin';
  const is_seller = current_user && current_user.role === 'Seller';
  const [services_data, set_services_data] = useState([]);

  useEffect(() => {
    const load_services = async () => {
      try {
        const service_list = await api_request('/services/list/', { method: 'GET' }, true);
        set_services_data(service_list);
      } catch (_error) {
        set_services_data([]);
      }
    };

    load_services();
  }, []);

  const handle_sign_out = () => {
    dispatch(signout());
  };

  return (
    <Container className="py-5 theme-page">
      <Row className="mb-4">
        <Col>
          <div className="theme-hero p-4 p-md-5">
            <Row className="align-items-center g-4">
              <Col lg={7}>
                <p className="text-uppercase small fw-semibold mb-2">Car Wash Platform</p>
                <h1 className="display-5 fw-bold mb-3">Premium Car Wash & Detailing</h1>
                <p className="text-muted mb-4">
                  Book trusted detailing services, compare seller offers, and manage every order from one dashboard.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/profile" className="btn btn-primary">
                    View Profile
                  </Link>
                  <Link to="/apply-seller" className="btn btn-outline-primary">
                    Become a Seller
                  </Link>
                  {is_seller && (
                    <Link to="/seller-dashboard" className="btn btn-success">
                      Seller Dashboard
                    </Link>
                  )}
                  {is_admin && (
                    <Link to="/users" className="btn btn-dark">
                      Admin Users
                    </Link>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={handle_sign_out}
                  >
                    Sign Out
                  </button>
                </div>
              </Col>
              <Col lg={5}>
                <img
                  src="/car%20was.jpg"
                  alt="Car wash service"
                  className="img-fluid rounded-4"
                  style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {services_data.map((service_item) => (
          <Col key={service_item.id} md={6} lg={4}>
            <Link
              to={`/services/${service_item.id}`}
              className="text-decoration-none"
            >
              <Card className="h-100 shadow-sm border-0 themed-card service-card">
                <Card.Img
                  variant="top"
                  src={build_media_url(service_item.sample_image)}
                  alt={service_item.service_name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-5">{service_item.service_name}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {service_item.description}
                  </Card.Text>
                  <div>
                    <Badge bg="primary">Rating: {service_item.rating}</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomeScreen;
