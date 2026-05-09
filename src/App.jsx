import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { users, validateUser } from './data/users';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import UserProfile from './components/UserProfile';
import SavingsGoals from './components/SavingsGoals.jsx';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    // Clear localStorage on logout for security
    localStorage.removeItem('transactions');
  };

  return (
    <Router basename={import.meta.env.PROD ? '/test-repo' : ''}>
      <Routes>
        <Route
          path="/"
          element={user ? (
            <Dashboard user={user} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        />
        <Route
          path="/profile"
          element={<UserProfile />}
        />
        <Route
          path="/goals"
          element={<SavingsGoals />}
        />
      </Routes>
    </Router>
  );
}

export default App;