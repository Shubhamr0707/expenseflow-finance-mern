import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import { incomeAPI } from '../utils/api';
import { formatCurrency, formatDate, validateAmount } from '../utils/helpers';
import { toast } from 'react-toastify';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const { data } = await incomeAPI.getAll();
      setIncomes(data);
    } catch (error) {
      toast.error('Failed to fetch incomes');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (!validateAmount(formData.amount)) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.description || formData.description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (editingId) {
        await incomeAPI.update(editingId, formData);
        toast.success('Income updated successfully!');
      } else {
        await incomeAPI.create(formData);
        toast.success('Income added successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchIncomes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (income) => {
    setEditingId(income._id);
    setFormData({
      category: income.category,
      amount: income.amount,
      description: income.description,
      date: new Date(income.date).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await incomeAPI.delete(id);
        toast.success('Income deleted successfully!');
        fetchIncomes();
      } catch (error) {
        toast.error('Failed to delete income');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setErrors({});
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Income Management | ₹</h2>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => setShowModal(true)}>
            + Add Income
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <h6 className="text-uppercase">Total Income</h6>
              <h3>{formatCurrency(totalIncome)}</h3>
              <small>{incomes.length} transactions</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-3">Recent Income</h5>
          {incomes.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income) => (
                    <tr key={income._id}>
                      <td>{formatDate(income.date)}</td>
                      <td>{income.category}</td>
                      <td>{income.description}</td>
                      <td className="text-success fw-bold">{formatCurrency(income.amount)}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(income)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(income._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-muted text-center">No income records found. Add your first income!</p>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Income' : 'Add Income'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                isInvalid={!!errors.category}
              >
                <option value="">Select category</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Business">Business</option>
                <option value="Gift">Gift</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                isInvalid={!!errors.amount}
              />
              <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                isInvalid={!!errors.date}
              />
              <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                {editingId ? 'Update' : 'Add'} Income
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Income;
