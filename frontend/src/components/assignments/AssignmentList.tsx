import React, { useState, useEffect } from 'react';
import { 
  getAssignments, 
  createAssignment, 
  updateAssignment, 
  deleteAssignment,
  getEmployees,
  getProjects,
  getCapacityOverview
} from '../../services/api';

interface Assignment {
  id: string;
  employeeId: string;
  projectId: string;
  year: number;
  month: number;
  fteAllocation: number;
  description: string;
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  teamId: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface CapacityData {
  employee: Employee;
  totalFTE: number;
  availableFTE: number;
  assignments: any[];
  isOverloaded: boolean;
}

const AssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [capacityData, setCapacityData] = useState<CapacityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [activeTab, setActiveTab] = useState<'assignments' | 'capacity'>('assignments');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    projectId: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    fteAllocation: 0.5,
    description: ''
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'capacity') {
      loadCapacityData();
    }
  }, [activeTab, selectedYear, selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignmentsResponse, employeesResponse, projectsResponse] = await Promise.all([
        getAssignments(),
        getEmployees(),
        getProjects()
      ]);
      setAssignments(assignmentsResponse.data.data);
      setEmployees(employeesResponse.data.data);
      setProjects(projectsResponse.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadCapacityData = async () => {
    try {
      const response = await getCapacityOverview(selectedYear, selectedMonth);
      setCapacityData(response.data.data.capacityOverview);
    } catch (err: any) {
      setError(err.message || 'Failed to load capacity data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, formData);
      } else {
        await createAssignment(formData);
      }
      await loadData();
      if (activeTab === 'capacity') {
        await loadCapacityData();
      }
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save assignment');
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      employeeId: assignment.employeeId,
      projectId: assignment.projectId,
      year: assignment.year,
      month: assignment.month,
      fteAllocation: assignment.fteAllocation,
      description: assignment.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
        await loadData();
        if (activeTab === 'capacity') {
          await loadCapacityData();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete assignment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      projectId: '',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      fteAllocation: 0.5,
      description: ''
    });
    setEditingAssignment(null);
    setShowForm(false);
    setError(null);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(proj => proj.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const formatFTE = (fte: number) => {
    return `${Math.round(fte * 100)}%`;
  };

  if (loading) return <div className="loading">Loading assignments...</div>;

  return (
    <div className="assignment-list">
      <div className="page-header">
        <h2>Capacity Planning</h2>
        <div className="tab-controls">
          <button 
            className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'capacity' ? 'active' : ''}`}
            onClick={() => setActiveTab('capacity')}
          >
            Capacity Overview
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}

      {activeTab === 'assignments' && (
        <>
          <div className="assignments-header">
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Assignment
            </button>
          </div>

          {showForm && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>{editingAssignment ? 'Edit Assignment' : 'Add Assignment'}</h3>
                  <button onClick={resetForm} className="modal-close">×</button>
                </div>
                <form onSubmit={handleSubmit} className="assignment-form">
                  <div className="form-group">
                    <label htmlFor="employeeId">Employee *</label>
                    <select
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.position}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="projectId">Project *</label>
                    <select
                      id="projectId"
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      required
                    >
                      <option value="">Select Project</option>
                      {projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="year">Year *</label>
                      <input
                        type="number"
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        min="2020"
                        max="2030"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="month">Month *</label>
                      <select
                        id="month"
                        value={formData.month}
                        onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                        required
                      >
                        {months.map((month, index) => (
                          <option key={index + 1} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="fteAllocation">FTE Allocation (0.0 - 1.0) *</label>
                    <input
                      type="number"
                      id="fteAllocation"
                      value={formData.fteAllocation}
                      onChange={(e) => setFormData({ ...formData, fteAllocation: parseFloat(e.target.value) })}
                      min="0"
                      max="1"
                      step="0.1"
                      required
                    />
                    <small>0.5 = 50%, 1.0 = 100%</small>
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
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {editingAssignment ? 'Update' : 'Create'} Assignment
                    </button>
                    <button type="button" onClick={resetForm} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="assignments-grid">
            {assignments.length === 0 ? (
              <div className="empty-state">
                <p>No assignments found. Add your first assignment to get started.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Project</th>
                    <th>Period</th>
                    <th>FTE Allocation</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{getEmployeeName(assignment.employeeId)}</td>
                      <td>{getProjectName(assignment.projectId)}</td>
                      <td>{months[assignment.month - 1]} {assignment.year}</td>
                      <td>
                        <span className="fte-badge">
                          {formatFTE(assignment.fteAllocation)}
                        </span>
                      </td>
                      <td>{assignment.description || 'No description'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(assignment)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(assignment.id)}
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
        </>
      )}

      {activeTab === 'capacity' && (
        <div className="capacity-overview">
          <div className="capacity-controls">
            <div className="period-selector">
              <label htmlFor="capacityYear">Year:</label>
              <select
                id="capacityYear"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <label htmlFor="capacityMonth">Month:</label>
              <select
                id="capacityMonth"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={index + 1} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="capacity-grid">
            <h3>Capacity Overview for {months[selectedMonth - 1]} {selectedYear}</h3>
            {capacityData.length === 0 ? (
              <div className="empty-state">
                <p>No capacity data found for the selected period.</p>
              </div>
            ) : (
              <table className="data-table capacity-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Total FTE</th>
                    <th>Available</th>
                    <th>Status</th>
                    <th>Projects</th>
                  </tr>
                </thead>
                <tbody>
                  {capacityData.map((capacity) => (
                    <tr key={capacity.employee.id} className={capacity.isOverloaded ? 'overloaded' : ''}>
                      <td>{capacity.employee.name}</td>
                      <td>{capacity.employee.position}</td>
                      <td>
                        <span className={`fte-badge ${capacity.isOverloaded ? 'overloaded' : ''}`}>
                          {formatFTE(capacity.totalFTE)}
                        </span>
                      </td>
                      <td>
                        <span className="fte-badge">
                          {formatFTE(Math.max(0, capacity.availableFTE))}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${capacity.isOverloaded ? 'status-overloaded' : capacity.totalFTE === 1 ? 'status-full' : 'status-available'}`}>
                          {capacity.isOverloaded ? 'Overloaded' : capacity.totalFTE === 1 ? 'Full Capacity' : 'Available'}
                        </span>
                      </td>
                      <td>
                        <div className="project-assignments">
                          {capacity.assignments.map((assignment, index) => (
                            <div key={index} className="assignment-item">
                              <span className="project-name">{assignment.projectName}</span>
                              <span className="assignment-fte">{formatFTE(assignment.fteAllocation)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
