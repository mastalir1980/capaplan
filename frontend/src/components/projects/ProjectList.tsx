import React from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed' | 'on-hold';
}

const ProjectList: React.FC = () => {
  // This would be replaced with actual API calls in the future
  const projects: Project[] = [];

  return (
    <div className="project-list">
      <h2>Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found. Add your first project to get started.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{project.startDate}</td>
                <td>{project.endDate}</td>
                <td>{project.status}</td>
                <td>
                  <button className="btn btn-sm btn-primary">Edit</button>
                  <button className="btn btn-sm btn-info">Assignments</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn btn-primary">Add Project</button>
    </div>
  );
};

export default ProjectList;
