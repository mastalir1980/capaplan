import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import EmployeeList from './components/employees/EmployeeList';
import TeamList from './components/teams/TeamList';
import ProjectList from './components/projects/ProjectList';
import AssignmentList from './components/assignments/AssignmentList';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Capacity Planning Tool</h1>
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/employees">Employees</Link>
              </li>
              <li>
                <Link to="/teams">Teams</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/assignments">Assignments</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="App-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/assignments" element={<AssignmentList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Simple Dashboard component
const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Welcome to the Capacity Planning Tool. Use the navigation above to manage your resources.</p>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Employees</h3>
          <p>Manage your employees and their team assignments</p>
          <Link to="/employees" className="btn btn-primary">View Employees</Link>
        </div>
        <div className="card">
          <h3>Teams</h3>
          <p>Organize teams and create hierarchical structures</p>
          <Link to="/teams" className="btn btn-primary">View Teams</Link>
        </div>
        <div className="card">
          <h3>Projects</h3>
          <p>Create and manage projects for your organization</p>
          <Link to="/projects" className="btn btn-primary">View Projects</Link>
        </div>
        <div className="card">
          <h3>Assignments</h3>
          <p>Assign employees to projects with time allocations</p>
          <Link to="/assignments" className="btn btn-primary">View Assignments</Link>
        </div>
      </div>
    </div>
  );
};

export default App;
