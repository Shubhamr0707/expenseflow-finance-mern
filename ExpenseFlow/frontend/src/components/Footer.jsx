import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-4" style={{ 
      background: 'rgba(0,0,0,0.35)', 
      borderTop: '1px solid rgba(255,255,255,0.04)',
      backdropFilter: 'blur(6px)',
      color: 'var(--text-main)'
    }}>
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Expense Tracker</h5>
            <p className="text-muted">
              Your personal finance companion for smarter money management.
            </p>
          </Col>
          
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-decoration-none">Contact</Link></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none" aria-label="Facebook">
                <i className="bi bi-facebook" style={{ fontSize: '1.5rem' }}></i>
              </a>
              <a href="#" className="text-decoration-none" aria-label="Twitter">
                <i className="bi bi-twitter" style={{ fontSize: '1.5rem' }}></i>
              </a>
              <a href="#" className="text-decoration-none" aria-label="LinkedIn">
                <i className="bi bi-linkedin" style={{ fontSize: '1.5rem' }}></i>
              </a>
              <a href="#" className="text-decoration-none" aria-label="Instagram">
                <i className="bi bi-instagram" style={{ fontSize: '1.5rem' }}></i>
              </a>
            </div>
          </Col>
        </Row>
        
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-muted">
              &copy; {currentYear} Expense Tracker. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
