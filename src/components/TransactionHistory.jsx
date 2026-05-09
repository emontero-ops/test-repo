import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../data/users';
function TransactionHistory({ transactions, user, onEditTransaction, onDeleteTransaction }) {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Request permission for notifications if not already granted
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Handle storage events for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'transactions' && e.newValue) {
        // Show a subtle notification when data is updated from another tab
        showUpdateNotification();
        
        // Optionally, we could refresh the data here, but we rely on the 
        // parent component's useEffect that watches localStorage
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const showUpdateNotification = () => {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s forwards;
      ">
        Datos actualizados desde otra pestaña
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after animation completes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3500);
  };

  const requestPermission = () => {
    if (typeof Notification !== 'undefined') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showBrowserNotification('Datos actualizados', 'Los datos se han sincronizado desde otra pestaña');
        }
      });
    }
  };

  const showBrowserNotification = (title, body) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key === 'date') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortConfig.key === 'amount') {
      return a.amount - b.amount;
    }
    if (sortConfig.key === 'description') {
      return a.description.localeCompare(b.description);
    }
    return 0;
  });

  if (sortConfig.direction === 'desc') {
    sortedTransactions.reverse();
  }

  const handleSortClick = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="transaction-history">
      <div className="history-header">
        <h2>Historial de Transacciones</h2>
        <div className="history-actions">
          <button 
            className="sort-btn"
            onClick={() => handleSortClick('date')}
          >
            Fecha {sortConfig.key === 'date' ? 
              (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button 
            className="sort-btn"
            onClick={() => handleSortClick('amount')}
          >
            Monto {sortConfig.key === 'amount' ? 
              (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button 
            className="sort-btn"
            onClick={() => handleSortClick('description')}
          >
            Descripción {sortConfig.key === 'description' ? 
              (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <p>No hay transacciones registradas</p>
          <p className="hint">Agregue su primera transacción para comenzar</p>
        </div>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Usuario</th>
              <th className="actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map(transaction => (
              <tr key={transaction.id} className="transaction-row">
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td className={transaction.amount >= 0 ? 'amount-positive' : 'amount-negative'}>
                  {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount)}
                </td>
                <td>
                  {users.find(u => u.id === transaction.userId)?.name || 'Desconocido'}
                </td>
                <td className="actions-cell">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => onEditTransaction(transaction)}
                  >
                    Editar
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => onDeleteTransaction(transaction.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <div className="history-footer">
        <p>Total de transacciones: {transactions.length}</p>
        <p>Última actualización: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default TransactionHistory;