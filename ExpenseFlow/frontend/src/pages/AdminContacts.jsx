import { useState, useEffect, useContext } from 'react';
import { Container, Card, Table, Button, Badge } from 'react-bootstrap';
import { adminAPI } from '../utils/api';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminContacts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }
    fetchContacts();
  }, [user, navigate]);

  const fetchContacts = async () => {
    try {
      const { data } = await adminAPI.getContacts();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to fetch contact messages');
    }
  };

  const handleMarkAsReviewed = async (contactId) => {
    try {
      await adminAPI.updateContact(contactId, { status: 'reviewed' });
      toast.success('Contact marked as reviewed');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update contact status');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Contact Messages | ✉</h2>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-3">All Contact Messages</h5>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject}</td>
                    <td>{contact.message.substring(0, 50)}...</td>
                    <td>
                      <Badge bg={contact.status === 'pending' ? 'warning' : 'success'}>
                        {contact.status}
                      </Badge>
                    </td>
                    <td>{formatDate(contact.createdAt)}</td>
                    <td>
                      {contact.status === 'pending' && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleMarkAsReviewed(contact._id)}
                        >
                          Mark as Reviewed
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminContacts;
