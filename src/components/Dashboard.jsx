import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import SavingsDisplay from './SavingsDisplay';
import TransactionHistory from './TransactionHistory';
import { users } from '../data/users';

function Dashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
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

  const handleEditTransaction = (updatedTransaction) => {
    setTransactions(
      transactions.map(t =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
    // Reset editing state
    setEditingTransactionId(null);
  };

  const handleDeleteTransaction = (transactionId) => {
    setTransactions(transactions.filter(t => t.id !== transactionId));
  };

  // Pre-fill form when editing a transaction
  const editTransaction = transactions.find(
    t => t.id === editingTransactionId
  );

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Menú</h2>
        <div className="nav-links">
          <button onClick={() => onLogout()}>Cerrar sesión</button>
          <button onClick={() => navigate('/profile')}>Mi Perfil</button>
          <button onClick={() => navigate('/goals')}>Metas</button>
        </div>
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
              currentUser={user}
              allUsers={users}
              editingTransaction={editTransaction}
              onEditTransaction={handleEditTransaction}
            />
          </div>
        )}
        
        <TransactionHistory
          transactions={transactions}
          user={user}
          onEditTransaction={(t) => setEditingTransactionId(t.id)}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </main>
    </div>
  );
}

export default Dashboard;