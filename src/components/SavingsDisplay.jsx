import React from 'react';
import SavingsChart from './SavingsChart';

function SavingsDisplay({ user, totalSavings, individualSavings, transactions }) {
  const userSavings = individualSavings[user.id] || 0;
  
  // Get recent transactions (last 5)
  const recentTransactions = [...transactions].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="savings-display">
      <h2>Resumen de Ahorros</h2>
      
      <div className="metrics">
        <div className="metric-card">
          <h3>Total Ahorrado</h3>
          <p>${totalSavings.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Tu Ahorro</h3>
          <p>${userSavings.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Miembros</h3>
          <p>{Object.keys(individualSavings).length} personas</p>
        </div>
      </div>
      
      <div className="recent-transactions">
        <h3>Últimas Transacciones</h3>
        {recentTransactions.length > 0 ? (
          <ul>
            {recentTransactions.map(t => (
              <li key={t.id} className={t.type === 'withdrawal' ? 'withdrawal' : 'deposit'}>
                <strong>{t.userName}:</strong> 
                <span className="amount">{t.type === 'withdrawal' ? '-' : ''}${Math.abs(t.amount)}</span>
                <span>({t.date})</span>
                <br />
                <small>{t.description}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay transacciones aún</p>
        )}
      </div>
      
      <div className="chart-section">
        <h3>Evolución del Ahorro Familiar</h3>
        <SavingsChart transactions={transactions} />
      </div>
    </div>
  );
}

export default SavingsDisplay;