import React from 'react';

interface Team {
  id: string;
  name: string;
  description: string;
  parentTeamId: string | null;
}

const TeamList: React.FC = () => {
  // This would be replaced with actual API calls in the future
  const teams: Team[] = [];

  return (
    <div className="team-list">
      <h2>Teams</h2>
      {teams.length === 0 ? (
        <p>No teams found. Add your first team to get started.</p>
      ) : (
        <table className="table">
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
                <td>{team.description}</td>
                <td>{team.parentTeamId || 'None'}</td>
                <td>
                  <button className="btn btn-sm btn-primary">Edit</button>
                  <button className="btn btn-sm btn-info">View Hierarchy</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn btn-primary">Add Team</button>
    </div>
  );
};

export default TeamList;
