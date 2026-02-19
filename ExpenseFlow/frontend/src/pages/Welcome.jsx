import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

const Welcome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="text-center mb-5">
            <h1 className="display-3 fw-bold text-black mb-3">
              Expense Tracker
            </h1>
            <p className="lead text-muted">
              Your personal finance companion for smarter money management
            </p>
          </div>

          <Row className="mb-5">
            <Col md={4} className="mb-3">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <div className="display-4 text-primary mb-3">📊</div>
                  <Card.Title>Track Expenses</Card.Title>
                  <Card.Text>
                    Monitor your daily expenses and income with detailed categorization
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <div className="display-4 text-success mb-3">📈</div>
                  <Card.Title>Visual Analytics</Card.Title>
                  <Card.Text>
                    Get insights with beautiful charts and graphs of your spending habits
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="text-center">
                  <div className="display-4 text-info mb-3">🔒</div>
                  <Card.Title>Secure & Private</Card.Title>
                  <Card.Text>
                    Your data is protected with JWT authentication and role-based access
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="text-center">
            <h3 className="mb-4">Ready to get started?</h3>
            <Button 
              variant="primary" 
              size="lg" 
              className="me-3 mb-2"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg"
              className="mb-2"
              onClick={() => navigate('/register')}
            >
              Register Now
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
