import React, { useState } from 'react';

function UserProfile() {
  const [editingName, setEditingName] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Usuario');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || 'usuario@ejemplo.com');
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || 'https://via.placeholder.com/150');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState(profileImage);
  const [notificationsEnabled, setNotificationsEnabled] = useState(JSON.parse(localStorage.getItem('notificationsEnabled') || 'true'));
  const [themePreference, setThemePreference] = useState(localStorage.getItem('themePreference') || 'light');

  const handleSaveName = () => {
    setEditingName(false);
    localStorage.setItem('userName', userName);
  };

  const handleImageChange = () => {
    setProfileImage(imageUrl);
    localStorage.setItem('profileImage', imageUrl);
    setShowImageInput(false);
  };

  const handleToggleNotifications = (checked) => {
    setNotificationsEnabled(checked);
    localStorage.setItem('notificationsEnabled', JSON.stringify(checked));
  };

  const handleThemeChange = (e) => {
    setThemePreference(e.target.value);
    localStorage.setItem('themePreference', e.target.value);
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', e.target.value);
  };

  const handleLogout = () => {
    localStorage.clear();
    // In a real app, this would also clear auth tokens and redirect to login
    window.location.href = '/test-repo/';
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h2>Mi Perfil</h2>
        <p>Configura tu información y preferencias</p>
      </div>

      <div className="profile-card">
        <div className="profile-image-section">
          <img 
            src={profileImage} 
            alt="Foto de perfil" 
            className="profile-image"
            onClick={() => setShowImageInput(true)}
          />
          {!showImageInput && (
            <button className="change-photo-btn" onClick={() => setShowImageInput(true)}>
              Cambiar foto
            </button>
          )}
          {showImageInput && (
            <div className="image-input-section">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Pega aquí la URL de la imagen"
                className="image-url-input"
              />
              <div className="image-actions">
                <button className="save-btn" onClick={handleImageChange}>Guardar</button>
                <button className="cancel-btn" onClick={() => setShowImageInput(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-info-section">
          <div className="info-row">
            <label>Nombre de usuario:</label>
            {editingName ? (
              <div className="edit-field">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoFocus
                  className="name-input"
                />
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSaveName}>Guardar</button>
                  <button className="cancel-btn" onClick={() => setEditingName(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div>
                <span className="info-value">{userName}</span>
                <button className="edit-btn" onClick={() => setEditingName(true)}>Editar</button>
              </div>
            )}
          </div>

          <div className="info-row">
            <label>Correo electrónico:</label>
            <span className="info-value">{userEmail}</span>
            <small className="info-hint">(no editable en esta versión)</small>
          </div>
        </div>
      </div>

      <div className="preferences-card">
        <h3>Preferencias</h3>
        
        <div className="preference-item">
          <label className="preference-label">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => handleToggleNotifications(e.target.checked)}
            />
            Recibir notificaciones por transacciones importantes
          </label>
        </div>

        <div className="preference-item">
          <label>Tema de la aplicación:</label>
          <div className="theme-selector">
            <label>
              <input
                type="radio"
                value="light"
                checked={themePreference === 'light'}
                onChange={handleThemeChange}
              />
              Claro
            </label>
            <label>
              <input
                type="radio"
                value="dark"
                checked={themePreference === 'dark'}
                onChange={handleThemeChange}
              />
              Oscuro
            </label>
            <label>
              <input
                type="radio"
                value="auto"
                checked={themePreference === 'auto'}
                onChange={handleThemeChange}
              />
              Automático
            </label>
          </div>
        </div>
      </div>

      <div className="account-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default UserProfile;