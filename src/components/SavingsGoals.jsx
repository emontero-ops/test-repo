import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from './HeaderNav';
import { supabase } from '../supabaseClient';

function SavingsGoals({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'general'
  });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [error, setError] = useState('');
  const [goals, setGoals] = useState([]);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'emergency', label: 'Fondo de Emergencia' },
    { value: 'vacation', label: 'Vacaciones' },
    { value: 'education', label: 'Educación' },
    { value: 'home', label: 'Mejoras del Hogar' },
    { value: 'car', label: 'Vehículo' },
    { value: 'investment', label: 'Inversión' }
  ];
  const normalizeGoal = (g) => ({
    id: g.id,
    name: g.name,
    targetAmount: g.target_amount,
    currentAmount: g.current_amount,
    targetDate: g.target_date,
    category: g.category
  });


  // Load goals from Supabase
  useEffect(() => {
    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);
     
      if (error) {
        console.error('Error fetching goals:', error);
        // Fallback to localStorage if Supabase fails
        const saved = localStorage.getItem('savingsGoals');
        if (saved) setGoals(JSON.parse(saved));
        else setGoals([]);
      } else {
        setGoals((data || []).map(g => ({
          id: g.id,
          name: g.name,
          targetAmount: g.target_amount,
          currentAmount: g.current_amount,
          targetDate: g.target_date,
          category: g.category
        })));
      }
    };
    fetchGoals();
  }, [user.id]);

  // Sync goals to Supabase whenever they change (simplified for brevity)
  const saveGoalToSupabase = async (goal) => {
    if (goal.id <= 0) {
      // New goal being synced for the first time or legacy
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          target_date: goal.targetDate,
          category: goal.category
        })
        .select()
        .single();
      if (error) {
        console.error('Error inserting goal:', error);
        throw error;
      }
      return normalizeGoal(data);
    } else {
      // Update existing goal
      const { data, error } = await supabase
        .from('goals')
        .update({
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          target_date: goal.targetDate,
          category: goal.category
        })
        .eq('id', goal.id)
        .select()
        .single();
      if (error) {
        console.error('Error updating goal:', error);
        throw error;
      }
      return normalizeGoal(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newGoal.name.trim()) {
      setError('Por favor ingrese un nombre para la meta');
      return;
    }

    const targetAmount = parseFloat(newGoal.targetAmount) || 0;
    if (targetAmount <= 0) {
      setError('Por favor ingrese un monto objetivo válido');
      return;
    }

    if (!newGoal.targetDate) {
      setError('Por favor seleccione una fecha objetivo');
      return;
    }

    const currentAmount = parseFloat(newGoal.currentAmount) || 0;

    const goalData = {
      ...newGoal,
      targetAmount,
      currentAmount,
      id: editingGoalId !== null ? editingGoalId : -Date.now(), // Negative for new goal
    };

    try {
      if (editingGoalId) {
        // En lugar de reemplazar el ID, simplemente actualizamos en Supabase
        await saveGoalToSupabase(goalData);
        setGoals(goals.map(goal => goal.id === editingGoalId ? goalData : goal));
        setEditingGoalId(null);
      } else {
        // Guardar nueva meta
        const savedGoal = await saveGoalToSupabase(goalData);
        if (savedGoal) {
          setGoals([...goals.filter(g => g.id !== goalData.id), savedGoal]);
        }
      }

      // Reset form
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        category: 'general'
      });
      setError('');
    } catch (err) {
      console.error('Error saving goal:', err);
      setError('Error al guardar la meta. Por favor intente de nuevo.');
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoalId(goal.id);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate,
      category: goal.category
    });
  };

  const handleDeleteGoal = async (id) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
      if (error) throw error;
      // Remove from local state
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Error al eliminar la meta. Por favor intente de nuevo.');
    }
  };

  return (
    <div className={`savings-goals-page ${isMenuOpen ? 'menu-open' : ''}`}>
      <HeaderNav user={user} onLogout={onLogout} isOpen={isMenuOpen} onMenuToggle={(isOpen) => setIsMenuOpen(isOpen)} />
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
              onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
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
              onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingGoalId ? 'Actualizar Meta' : 'Agregar Meta'}
          </button>
          {!editingGoalId && (
            <button type="button" className="clear-btn" onClick={() => {
              setNewGoal({
                name: '',
                targetAmount: '',
                currentAmount: '',
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
            {goals.map((goal, index) => {
              const progress = goal.targetAmount > 0
                ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                : 0;

              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h3>{goal.name}</h3>
                    <span className="goal-category">{goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}</span>
                  </div>

                  <div className="goal-progress">
                    <div className="progress-label">
                      {progress.toFixed(0)}% Completado
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-bg"></div>
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      >
                        {progress > 0 && (
                          <span className="progress-text">{progress.toFixed(0)}%</span>
                        )}
                      </div>
                    </div>
                    <div className="progress-details">
                      <span>${goal.currentAmount} de ${goal.targetAmount}</span>
                    </div>
                  </div>

                  <div className="goal-details">
                    <div className="goal-detail">
                      <span>Objetivo:</span>
                      <span>${goal.targetAmount}</span>
                    </div>
                    <div className="goal-detail">
                      <span>Actual:</span>
                      <span>${goal.currentAmount}</span>
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
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
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
