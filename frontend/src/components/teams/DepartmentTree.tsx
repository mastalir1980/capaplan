import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DepartmentTree.css';

interface Department {
  _id: string;
  name: string;
  description: string;
  parentId: string | null;
  children?: Department[];
}

const DepartmentTree: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    parentId: ''
  });

  // Fetch department tree on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/departments/tree');
        setDepartments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch departments. Please try again later.');
        setLoading(false);
        console.error('Error fetching departments:', err);
      }
    };

    fetchDepartments();
  }, []);

  // Handle input change for new department form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDepartment({
      ...newDepartment,
      [name]: value
    });
  };

  // Handle form submission for new department
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/departments', newDepartment);
      // Refresh department tree after adding new department
      const response = await axios.get('/api/departments/tree');
      setDepartments(response.data);
      setNewDepartment({
        name: '',
        description: '',
        parentId: ''
      });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add department. Please check your inputs and try again.');
      console.error('Error adding department:', err);
    }
  };

  // Recursive component to render department tree
  const renderDepartmentTree = (departments: Department[], level = 0) => {
    return (
      <ul className={`department-list ${level === 0 ? 'root-list' : ''}`}>
        {departments.map((dept) => (
          <li key={dept._id} className="department-item">
            <div className="department-info" style={{ paddingLeft: `${level * 20}px` }}>
              <span className="department-name">{dept.name}</span>
              {dept.description && <span className="department-description">{dept.description}</span>}
            </div>
            {dept.children && dept.children.length > 0 && renderDepartmentTree(dept.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  // Flatten departments for select dropdown
  const flattenDepartments = (departments: Department[], level = 0, result: { id: string; name: string; level: number }[] = []) => {
    departments.forEach(dept => {
      result.push({
        id: dept._id,
        name: dept.name,
        level
      });
      if (dept.children && dept.children.length > 0) {
        flattenDepartments(dept.children, level + 1, result);
      }
    });
    return result;
  };

  if (loading) return <div className="loading">Loading departments...</div>;
  if (error) return <div className="error">{error}</div>;

  const flatDepartments = flattenDepartments(departments);

  return (
    <div className="department-tree-container">
      <h2>Department Structure</h2>
      
      <div className="actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Department'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-department-form">
          <h3>Add New Department</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Department Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newDepartment.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newDepartment.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="parentId">Parent Department</label>
              <select
                id="parentId"
                name="parentId"
                value={newDepartment.parentId}
                onChange={handleInputChange}
              >
                <option value="">None (Root Department)</option>
                {flatDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {'-'.repeat(dept.level)} {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">Add Department</button>
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

      {departments.length === 0 ? (
        <p>No departments found. Add your first department to get started.</p>
      ) : (
        <div className="department-tree">
          {renderDepartmentTree(departments)}
        </div>
      )}
    </div>
  );
};

export default DepartmentTree;
