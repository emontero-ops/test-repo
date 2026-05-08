import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import SavingsDisplay from './SavingsDisplay';
import TransactionHistory from './TransactionHistory';

function Dashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // Load transactions from localStorage (in a real app, this would be from an API)
  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const totalSavings = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Calculate individual savings
  const individualSavings = {};
  transactions.forEach(t => {
    if (!individualSavings[t.userId]) {
      individualSavings[t.userId] = 0;
    }
    individualSavings[t.userId] += t.amount;
  });

  const handleAddTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Menú</h2>
        <button onClick={() => onLogout()}>Cerrar sesión</button>
      </nav>
      
      <main className="main-content">
        <SavingsDisplay 
          user={user} 
          totalSavings={totalSavings} 
          individualSavings={individualSavings} 
          transactions={transactions} 
        />
        
        {user.role === 'admin' && (
          <div className="admin-section">
            <h3>Administrar Ahorros</h3>
            <TransactionForm 
              onAddTransaction={handleAddTransaction} 
              user={user} 
            />
          </div>
        )}
        
        <TransactionHistory 
          transactions={transactions} 
          user={user} 
        />
      </main>
    </div>
  );
}

export default Dashboard;
