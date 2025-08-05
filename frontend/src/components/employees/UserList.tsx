import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config';
import './UserList.css';

interface User {
  _id: string;
  name: string;
  email: string;
  position: string;
  departmentId: string;
}

interface Department {
  _id: string;
  name: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    position: '',
    departmentId: ''
  });

  // Fetch users and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, departmentsResponse] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/api/users`),
          axios.get(`${config.API_BASE_URL}/api/departments`)
        ]);
        setUsers(usersResponse.data);
        setDepartments(departmentsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle input change for new user form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  // Handle form submission for new user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/users`, newUser);
      setUsers([...users, response.data]);
      setNewUser({
        name: '',
        email: '',
        position: '',
        departmentId: ''
      });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add user. Please check your inputs and try again.');
      console.error('Error adding user:', err);
    }
  };

  // Handle user deletion
  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${config.API_BASE_URL}/api/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError('Failed to delete user. Please try again later.');
        console.error('Error deleting user:', err);
      }
    }
  };

  // Find department name by ID
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(dept => dept._id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-list-container">
      <h2>User Management</h2>
      
      <div className="actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-user-form">
          <h3>Add New User</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={newUser.position}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="departmentId">Department</label>
              <select
                id="departmentId"
                name="departmentId"
                value={newUser.departmentId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(department => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">Add User</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {users.length === 0 ? (
        <p>No users found. Add your first user to get started.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.position}</td>
                <td>{getDepartmentName(user.departmentId)}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
