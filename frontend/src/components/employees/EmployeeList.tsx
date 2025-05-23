import React from 'react';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  teamId: string;
}

const EmployeeList: React.FC = () => {
  // This would be replaced with actual API calls in the future
  const employees: Employee[] = [];

  return (
    <div className="employee-list">
      <h2>Employees</h2>
      {employees.length === 0 ? (
        <p>No employees found. Add your first employee to get started.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>
                  <button className="btn btn-sm btn-primary">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn btn-primary">Add Employee</button>
    </div>
  );
};

export default EmployeeList;
