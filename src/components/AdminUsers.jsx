import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import HeaderNav from './HeaderNav';

function AdminUsers({ user, onLogout }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) console.error('Error fetching profiles:', error);
      else setProfiles(data);
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const updateRole = async (profileId, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profileId);
    
    if (error) {
      alert('Error updating role');
    } else {
      setProfiles(profiles.map(p => p.id === profileId ? { ...p, role: newRole } : p));
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (user.role !== 'admin') return <div>Acceso denegado.</div>;

  return (
    <div className="admin-page">
      <HeaderNav user={user} onLogout={onLogout} />
      <h2>Administración de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map(profile => (
            <tr key={profile.id}>
              <td>{profile.name}</td>
              <td>{profile.role}</td>
              <td>
                <button onClick={() => updateRole(profile.id, profile.role === 'admin' ? 'member' : 'admin')}>
                  Cambiar a {profile.role === 'admin' ? 'Member' : 'Admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
