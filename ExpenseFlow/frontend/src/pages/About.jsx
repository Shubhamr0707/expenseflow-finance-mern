import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  const teamMembers = [
    {
      name: 'Shubham Rokade',
      image: '/images/shubham.jpg'
    },
    {
      name: 'Sneha Bhong',
      image: '/images/Sneha.png'
    },
    {
      name: 'Devendra Deore',
      image: '/images/shubham.jpg'
    }
  ];

  return (
    <Container className="mt-4">
      <Row className="justify-content-center mb-5">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4">About Us</h1>
        </Col>
      </Row>


      <Row className="mb-5">
        <Col md={12}>
          <h3 className="text-center mb-4">Meet Our Team</h3>
        </Col>
        {teamMembers.map((member, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className="h-100 shadow-sm border-0 text-center">
              <Card.Body className="p-4">
                {member.image ? (
                <div className="mb-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-circle mb-3"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                </div>
              ) : null}
                <h5 className="mb-2">{member.name}</h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm border-0 text-white" style={{ background: 'rgba(12,14,16,0.62)' }}>
            <Card.Body className="p-5 text-center">
              <h4 className="mb-3">Technology Stack</h4>
              <p className="mb-4">
                Built with modern technologies for the best performance and user experience
              </p>
              <Row>
                <Col md={3} className="mb-3">
                  <h5>MongoDB</h5>
                  <p className="small">Database</p>
                </Col>
                <Col md={3} className="mb-3">
                  <h5>Express.js</h5>
                  <p className="small">Backend Framework</p>
                </Col>
                <Col md={3} className="mb-3">
                  <h5>React</h5>
                  <p className="small">Frontend Library</p>
                </Col>
                <Col md={3} className="mb-3">
                  <h5>Node.js</h5>
                  <p className="small">Runtime Environment</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
