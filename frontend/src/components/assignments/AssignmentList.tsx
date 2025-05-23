import React from 'react';

interface Assignment {
  id: string;
  employeeId: string;
  projectId: string;
  startDate: string;
  endDate: string;
  allocationPercentage: number;
  role: string;
}

const AssignmentList: React.FC = () => {
  // This would be replaced with actual API calls in the future
  const assignments: Assignment[] = [];

  return (
    <div className="assignment-list">
      <h2>Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments found. Add your first assignment to get started.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Project</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Allocation %</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.employeeId}</td>
                <td>{assignment.projectId}</td>
                <td>{assignment.startDate}</td>
                <td>{assignment.endDate}</td>
                <td>{assignment.allocationPercentage}%</td>
                <td>{assignment.role}</td>
                <td>
                  <button className="btn btn-sm btn-primary">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn btn-primary">Add Assignment</button>
    </div>
  );
};

export default AssignmentList;
