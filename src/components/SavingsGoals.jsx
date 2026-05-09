import React, { useState } from 'react';

function SavingsGoals({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }) {
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    category: 'general'
  });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [error, setError] = useState('');

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'emergency', label: 'Fondo de Emergencia' },
    { value: 'vacation', label: 'Vacaciones' },
    { value: 'education', label: 'Educación' },
    { value: 'home', label: 'Mejoras del Hogar' },
    { value: 'car', label: 'Vehículo' },
    { value: 'debt', label: 'Pago de Deudas' },
    { value: 'investment', label: 'Inversión' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newGoal.name.trim()) {
      setError('Por favor ingrese un nombre para la meta');
      return;
    }
    
    if (newGoal.targetAmount <= 0) {
      setError('Por favor ingrese un monto objetivo válido');
      return;
    }
    
    if (!newGoal.targetDate) {
      setError('Por favor seleccione una fecha objetivo');
      return;
    }
    
    const goalData = {
      ...newGoal,
      currentAmount: newGoal.currentAmount || 0,
      progress: newGoal.targetAmount > 0 
        ? Math.min((newGoal.currentAmount / newGoal.targetAmount) * 100, 100)
        : 0
    };

    if (editingGoalId) {
      onUpdateGoal(editingGoalId, goalData);
      setEditingGoalId(null);
    } else {
      onAddGoal(goalData);
    }
    
    // Reset form
    setNewGoal({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
      category: 'general'
    });
    setError('');
  };

  const handleEditGoal = (goal) => {
    setEditingGoalId(goal.id);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
      category: goal.category
    });
  };

  return (
    <div className="savings-goals">
      <h2>Metas de Ahorro</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="goals-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre de la Meta:</label>
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
              placeholder="Ej: Fondo de emergencia, viaje a Europa"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Categoría:</label>
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Monto Objetivo ($):</label>
            <input
              type="number"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({...newGoal, targetAmount: parseFloat(e.target.value) || 0})}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Fecha Objetivo:</label>
            <input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Monto Actual ($):</label>
            <input
              type="number"
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal({...newGoal, currentAmount: parseFloat(e.target.value) || 0})}
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit">
            {editingGoalId ? 'Actualizar Meta' : 'Agregar Meta'}
          </button>
          {!editingGoalId && (
            <button type="button" onClick={() => {
              setNewGoal({
                name: '',
                targetAmount: 0,
                currentAmount: 0,
                targetDate: '',
                category: 'general'
              });
              setError('');
            }}>
              Limpiar
            </button>
          )}
        </div>
      </form>
      
      {goals.length > 0 && (
        <div className="goals-list">
          <h3>Mis Metas</h3>
          <div className="goals-grid">
            {goals.map(goal => (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <h3>{goal.name}</h3>
                  <span className="goal-category">{goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}</span>
                </div>
                
                <div className="goal-progress">
                  <div className="progress-label">
                    Progreso: {goal.progress.toFixed(1)}%
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="goal-details">
                  <div className="goal-detail">
                    <span>Objetivo:</span>
                    <span>${goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <div className="goal-detail">
                    <span>Actual:</span>
                    <span>${goal.currentAmount.toFixed(2)}</span>
                  </div>
                  <div className="goal-detail">
                    <span>Fecha objetivo:</span>
                    <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="goal-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEditGoal(goal)}
                  >
                    Editar
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => onDeleteGoal(goal.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {goals.length === 0 && (
        <div className="empty-state">
          <p>No hay metas de ahorro todavía</p>
          <p className="hint">Establezca su primera meta para comenzar a ahorrar hacia un objetivo específico</p>
        </div>
      )}
    </div>
  );
}

export default SavingsGoals;