import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeaderNav({ user, onLogout, isOpen, onMenuToggle }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    onMenuToggle(false); // Close menu on navigation
    navigate(path);
  };

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle(!isOpen); // Notify parent of new state
    }
  };

  return (
    <>
      {/* Overlay para cerrar el menú al hacer clic fuera */}
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={() => onMenuToggle(false)}></div>

      {/* Top Header para el botón de menú en móvil */}
      <div className="top-header">
        <div className="navbar-header">
          <button className="menu-toggle" onClick={handleMenuToggle}>
            {isOpen ? '✕' : '☰'} 
          </button>
          <h2>Banquito Montero</h2>
        </div>
      </div>

      {/* Navbar lateral */}
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="nav-links-container">
          <button onClick={() => handleNavigation('/dashboard')}>Dashboard</button>
          <button onClick={() => handleNavigation('/profile')}>Mi Perfil</button>
          <button onClick={() => handleNavigation('/goals')}>Metas</button>
          {/* Puedes añadir más enlaces aquí si es necesario */}
          <button onClick={() => handleNavigation('/admin')}>Administración</button>
          <button className="logout-button" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </nav>
    </>
  );
}

export default HeaderNav;
