import React, { useState, useEffect } from 'react';

function TransactionForm({ onAddTransaction, currentUser, allUsers, editingTransaction, onEditTransaction }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('deposit'); // deposit or withdrawal
  const [selectedUserId, setSelectedUserId] = useState(currentUser.id);
  const [error, setError] = useState('');

  // Determine if user can select other users (only admin)
  const canSelectOtherUsers = currentUser.role === 'admin';
  const userOptions = canSelectOtherUsers ? allUsers : [currentUser];

  // Initialize form with editing transaction data if provided
  useEffect(() => {
    if (editingTransaction) {
      setAmount(Math.abs(editingTransaction.amount).toString());
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
      setType(editingTransaction.amount >= 0 ? 'deposit' : 'withdrawal');
      setSelectedUserId(editingTransaction.userId);
    } else {
      // Reset to current user when not editing
      setSelectedUserId(currentUser.id);
      setType('deposit');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setError('');
    }
  }, [editingTransaction]);

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
    
    // Find selected user
    const selectedUser = allUsers.find(u => u.id === selectedUserId);
    if (!selectedUser) {
      setError('Usuario no válido');
      return;
    }
    
    // For withdrawal, store as negative amount
    const finalAmount = type === 'withdrawal' ? -amountNum : amountNum;
    
    const transaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      userId: selectedUser.id,
      userName: selectedUser.name,
      amount: finalAmount,
      description: description.trim(),
      date: date,
      type: type // store type for display
    };
    
    if (editingTransaction) {
      onEditTransaction(transaction);
    } else {
      onAddTransaction(transaction);
    }
    
    // Reset form
    setAmount('');
    setDescription('');
    setType('deposit');
    setSelectedUserId(currentUser.id);
    setError('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h3>{editingTransaction ? 'Editar Movimiento' : 'Registrar Movimiento'}</h3>
      {error && <div className="error">{error}</div>}
      
      {canSelectOtherUsers && (
        <div>
          <label>Usuario:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
          >
            {userOptions.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role === 'admin' ? 'Administrador' : 'Miembro'})
              </option>
            ))}
          </select>
        </div>
      )}
      
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
      <button type="submit">
        {editingTransaction ? 'Guardar Cambios' : (type === 'deposit' ? 'Registrar Ahorro' : 'Registrar Retiro')}
      </button>
      {!editingTransaction && (
        <button type="button" onClick={() => {
          setAmount('');
          setDescription('');
          setType('deposit');
          setSelectedUserId(currentUser.id);
          setError('');
        }}>
          Limpiar
        </button>
      )}
    </form>
  );
}

export default TransactionForm;