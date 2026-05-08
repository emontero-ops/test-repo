
import React, { useState } from 'react';

function TransactionForm({ onAddTransaction, user }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('deposit'); // deposit or withdrawal
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Por favor ingrese un monto válido');
      return;
    }
    
    if (!description.trim()) {
      setError('Por favor ingrese una descripción');
      return;
    }
    
    // For withdrawal, store as negative amount
    finalAmount = type === 'withdrawal' ? -amountNum : amountNum;
    
    const transaction = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      amount: finalAmount,
      description: description.trim(),
      date: date,
      type: type // store type for display
    };
    
    onAddTransaction(transaction);
    setAmount('');
    setDescription('');
    setType('deposit');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h3>Registrar Movimiento</h3>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Tipo:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="deposit">Depósito (Ahorro)</option>
          <option value="withdrawal">Retiro</option>
        </select>
      </div>
      <div>
        <label>Monto ($):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
      </div>
      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Ahorro semanal, ingreso adicional, pago de servicio..."
          required
        />
      </div>
      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">{type === 'deposit' ? 'Registrar Ahorro' : 'Registrar Retiro'}</button>
    </form>
  );
}

export default TransactionForm;
