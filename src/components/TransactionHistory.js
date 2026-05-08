
import React from 'react';

function TransactionHistory({ transactions, user }) {
  // Filter transactions: admin sees all, users see only their own
  const visibleTransactions = user.role === 'admin' 
    ? transactions 
    : transactions.filter(t => t.userId === user.id);

  // Group by date for better display
  const transactionsByDate = {};
  visibleTransactions.forEach(t => {
    const date = t.date;
    if (!transactionsByDate[date]) {
      transactionsByDate[date] = [];
    }
    transactionsByDate[date].push(t);
  });

  const sortedDates = Object.keys(transactionsByDate).sort().reverse();

  return (
    <div className="transaction-history">
      <h3>Historial de Transacciones</h3>
      {visibleTransactions.length === 0 ? (
        <p>No hay transacciones para mostrar</p>
      ) : (
        <div>
          {sortedDates.map(date => (
            <div key={date} className="date-group">
              <h4>{date}</h4>
              <ul>
                {transactionsByDate[date].map(t => (
                  <li key={t.id} className="transaction-item">
                    <div className="transaction-content">
                      <span className="user-name">{t.userName}:</span>
                      <span className="amount">${t.amount}</span>
                    </div>
                    <p className="description">{t.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
