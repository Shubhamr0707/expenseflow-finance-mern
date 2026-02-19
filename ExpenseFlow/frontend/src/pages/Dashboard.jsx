import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import AuthContext from '../context/AuthContext';
import { incomeAPI, expenseAPI } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        incomeAPI.getAll(),
        expenseAPI.getAll()
      ]);

      setIncomes(incomeRes.data);
      setExpenses(expenseRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;

  // Bar Chart Data
  const barChartData = {
    labels: ['Income', 'Expenses', 'Balance'],
    datasets: [
      {
        label: 'Amount (\u20B9)',
        data: [totalIncome, totalExpense, balance],
        backgroundColor: ['green', 'red', 'blue'],
        borderColor: ['darkgreen', 'darkred', 'darkblue'],
        borderWidth: 1
      }
    ]
  };

  // Pie Chart Data - Expense Categories
  const expenseCategories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        label: 'Expense Distribution',
        data: Object.values(expenseCategories),
        backgroundColor: [
          'crimson',
          'dodgerblue',
          'gold',
          'mediumturquoise',
          'mediumpurple',
          'orange',
          'crimson',
          'silver'
        ],
        borderWidth: 1
      }
    ]
  };

  const recentActivities = [...incomes, ...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Welcome, {user?.name}! </h2>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <h6 className="text-uppercase">Total Income</h6>
              <h3>{formatCurrency(totalIncome)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 bg-danger text-white">
            <Card.Body>
              <h6 className="text-uppercase">Total Expenses</h6>
              <h3>{formatCurrency(totalExpense)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className={`shadow-sm border-0 ${balance >= 0 ? 'bg-primary' : 'bg-warning'} text-white`}>
            <Card.Body>
              <h6 className="text-uppercase">Balance</h6>
              <h3>{formatCurrency(balance)}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0 mb-3">
            <Card.Body>
              <h5 className="mb-3">Financial Overview</h5>
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0 mb-3">
            <Card.Body>
              <h5 className="mb-3">Expense Distribution</h5>
              {Object.keys(expenseCategories).length > 0 ? (
                <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              ) : (
                <p className="text-muted text-center">No expense data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-3">Recent Activity</h5>
          {recentActivities.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity, index) => (
                    <tr key={index}>
                      <td>
                        {incomes.includes(activity) ? 'Income' : 'Expense'}
                      </td>
                      <td>{activity.category}</td>
                      <td>{activity.description}</td>
                      <td className={incomes.includes(activity) ? 'text-success' : 'text-danger'}>
                        {formatCurrency(activity.amount)}
                      </td>
                      <td>{formatDate(activity.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-center">No recent activity</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
