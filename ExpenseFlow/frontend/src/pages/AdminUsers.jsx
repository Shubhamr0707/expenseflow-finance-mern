import { useState, useEffect, useContext } from 'react';
import { Container, Card, Table, Button, Badge } from 'react-bootstrap';
import { adminAPI } from '../utils/api';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their data.')) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">User Management | ⚙</h2>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-3">All Users</h5>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <Badge bg={u.role === 'admin' ? 'danger' : 'primary'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      {u._id !== user._id && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          Delete
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

export default AdminUsers;
