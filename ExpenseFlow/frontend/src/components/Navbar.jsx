import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to={user ? (user.role === 'admin' ? '/admin/users' : '/dashboard') : '/'}>
           Expense Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user ? (
            <Nav className="ms-auto">
              {user.role === 'admin' ? (
                // Admin Navbar - Only Admin Panel sections
                <>
                  <Nav.Link as={Link} to="/admin/users">User Management</Nav.Link>
                  <Nav.Link as={Link} to="/admin/contacts">Contact Messages</Nav.Link>
                  <Nav.Item className="d-flex align-items-center ms-3">
                    <span className="text-light me-3">Welcome, {user.name}!</span>
                    <Button variant="outline-light" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Nav.Item>
                </>
              ) : (
                // Regular User Navbar
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/income">Income</Nav.Link>
                  <Nav.Link as={Link} to="/expense">Expense</Nav.Link>
                  <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
                  <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                  <Nav.Item className="d-flex align-items-center ms-3">
                    <span className="text-light me-3">Welcome, {user.name}!</span>
                    <Button variant="outline-light" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Nav.Item>
                </>
              )}
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">
                <Button variant="outline-light" size="sm">Login</Button>
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                <Button variant="outline-light" size="sm">Register</Button>
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
