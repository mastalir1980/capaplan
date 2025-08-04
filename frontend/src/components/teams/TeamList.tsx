import React, { useState, useEffect } from 'react';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../../services/api';

interface Team {
  id: string;
  name: string;
  description: string;
  parentTeamId: string | null;
  createdAt: string;
}

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentTeamId: ''
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const response = await getTeams();
      setTeams(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, formData);
      } else {
        await createTeam(formData);
      }
      await loadTeams();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save team');
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description,
      parentTeamId: team.parentTeamId || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await deleteTeam(id);
        await loadTeams();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete team');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', parentTeamId: '' });
    setEditingTeam(null);
    setShowForm(false);
    setError(null);
  };

  const getParentTeamName = (parentTeamId: string | null) => {
    if (!parentTeamId) return 'Root Level';
    const parentTeam = teams.find(t => t.id === parentTeamId);
    return parentTeam ? parentTeam.name : 'Unknown Parent';
  };

  const getAvailableParentTeams = () => {
    if (!editingTeam) return teams;
    // Filter out the team being edited and its descendants to prevent circular references
    return teams.filter(team => team.id !== editingTeam.id);
  };

  if (loading) return <div className="loading">Loading teams...</div>;

  return (
    <div className="team-list">
      <div className="page-header">
        <h2>Team Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Team
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingTeam ? 'Edit Team' : 'Add Team'}</h3>
              <button onClick={resetForm} className="modal-close">×</button>
            </div>
            <form onSubmit={handleSubmit} className="team-form">
              <div className="form-group">
                <label htmlFor="name">Team Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label htmlFor="parentTeamId">Parent Team</label>
                <select
                  id="parentTeamId"
                  value={formData.parentTeamId}
                  onChange={(e) => setFormData({ ...formData, parentTeamId: e.target.value })}
                >
                  <option value="">Root Level</option>
                  {getAvailableParentTeams().map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingTeam ? 'Update' : 'Create'} Team
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="teams-grid">
        {teams.length === 0 ? (
          <div className="empty-state">
            <p>No teams found. Add your first team to get started.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Parent Team</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.name}</td>
                  <td>{team.description || 'No description'}</td>
                  <td>{getParentTeamName(team.parentTeamId)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(team)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(team.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeamList;
