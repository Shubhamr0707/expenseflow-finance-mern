# ExpenseFlow - Personal Finance Manager 💰

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**ExpenseFlow** is a powerful and intuitive full-stack web application designed to help users track their income and expenses efficiently. Built with the **MERN (MongoDB, Express, React, Node.js)** stack, it provides a seamless experience for managing personal finances with visual insights.

---

## 🚀 Features

-   **🔐 Secure Authentication**: User registration and login system using JWT and Bcrypt.
-   **📊 Interactive Dashboard**: Visualize your financial health with dynamic charts (powered by Chart.js).
-   **💸 Income & Expense Tracking**: Easily add, edit, and delete income and expense records.
-   **📱 Responsive Design**: Fully responsive UI built with **React** and **Bootstrap**, accessible on all devices.
-   **🛡️ Admin Panel**: Dedicated admin interface to manage users and view contact inquiries.
-   **📩 Contact Support**: Integrated contact form for user feedback and support.

---

## 🛠️ Tech Stack

### Frontend
-   **React (Vite)**: Fast and modern frontend framework.
-   **Bootstrap / React-Bootstrap**: For responsive and compliant UI data design.
-   **Chart.js / react-chartjs-2**: To visualize financial data.
-   **Axios**: For handling HTTP requests.
-   **React Toastify**: For beautiful notifications.

### Backend
-   **Node.js & Express.js**: RESTful API server.
-   **MongoDB & Mongoose**: NoSQL database for flexible data storage.
-   **JSON Web Token (JWT)**: For secure stateless authentication.
-   **Bcrypt.js**: For password hashing and security.
-   **Express-Validator**: For payload validation.

---

## 📂 Project Structure

```bash
ExpenseFlow/
├── backend/          # Node.js & Express Backend
│   ├── models/       # Mongoose Schemas (User, Expense, Income, Contact)
│   ├── routes/       # API Routes (Auth, Expense, Income, Admin)
│   ├── middleware/   # Auth & Validation Middleware
│   └── server.js     # Entry point
│
└── frontend/         # React Frontend (Vite)
    ├── src/
    │   ├── components/  # Reusable UI Components
    │   ├── pages/       # Application Pages (Dashboard, Login, Expense, etc.)
    │   ├── context/     # Global State Management
    │   └── utils/       # Helper functions
    └── package.json
```

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites
-   **Node.js** (v14 or higher)
-   **MongoDB** (Local or Atlas URL)
-   **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Shubhamr0707/expenseflow-finance-mern.git
cd expenseflow-finance-mern
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The app should now be running at `http://localhost:5173` (or the port shown in your terminal).

---

## 🔌 API Endpoints

### Auth
-   `POST /api/v1/auth/register` - Register a new user
-   `POST /api/v1/auth/login` - Login user

### Transactions
-   `POST /api/v1/income/add-income` - Add Income
-   `GET /api/v1/income/get-incomes` - Get All Incomes
-   `DELETE /api/v1/income/delete-income/:id` - Delete Income
-   `POST /api/v1/expense/add-expense` - Add Expense
-   `GET /api/v1/expense/get-expenses` - Get All Expenses
-   `DELETE /api/v1/expense/delete-expense/:id` - Delete Expense

*(Note: Add headers `Authorization: Bearer <token>` for protected routes)*

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Shubham**
-   GitHub: [@Shubhamr0707](https://github.com/Shubhamr0707)

---

Check out the [Live Demo](#) (If available) or feel free to fork and explore!
