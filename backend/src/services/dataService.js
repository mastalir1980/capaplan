const fs = require('fs').promises;
const path = require('path');

class DataService {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
  }

  async readFile(filename) {
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; // Return empty array if file doesn't exist
      }
      throw error;
    }
  }

  async writeFile(filename, data) {
    try {
      const filePath = path.join(this.dataDir, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Employee operations
  async getEmployees() {
    return await this.readFile('employees.json');
  }

  async saveEmployee(employee) {
    const employees = await this.getEmployees();
    const newEmployee = {
      id: this.generateId(),
      ...employee,
      createdAt: new Date().toISOString()
    };
    employees.push(newEmployee);
    await this.writeFile('employees.json', employees);
    return newEmployee;
  }

  async updateEmployee(id, employeeData) {
    const employees = await this.getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    employees[index] = { ...employees[index], ...employeeData, updatedAt: new Date().toISOString() };
    await this.writeFile('employees.json', employees);
    return employees[index];
  }

  async deleteEmployee(id) {
    const employees = await this.getEmployees();
    const filteredEmployees = employees.filter(emp => emp.id !== id);
    if (employees.length === filteredEmployees.length) {
      throw new Error('Employee not found');
    }
    await this.writeFile('employees.json', filteredEmployees);
    return true;
  }

  // Team operations
  async getTeams() {
    return await this.readFile('teams.json');
  }

  async saveTeam(team) {
    const teams = await this.getTeams();
    const newTeam = {
      id: this.generateId(),
      ...team,
      createdAt: new Date().toISOString()
    };
    teams.push(newTeam);
    await this.writeFile('teams.json', teams);
    return newTeam;
  }

  async updateTeam(id, teamData) {
    const teams = await this.getTeams();
    const index = teams.findIndex(team => team.id === id);
    if (index === -1) {
      throw new Error('Team not found');
    }
    teams[index] = { ...teams[index], ...teamData, updatedAt: new Date().toISOString() };
    await this.writeFile('teams.json', teams);
    return teams[index];
  }

  async deleteTeam(id) {
    const teams = await this.getTeams();
    const filteredTeams = teams.filter(team => team.id !== id);
    if (teams.length === filteredTeams.length) {
      throw new Error('Team not found');
    }
    await this.writeFile('teams.json', filteredTeams);
    return true;
  }

  // Project operations
  async getProjects() {
    return await this.readFile('projects.json');
  }

  async saveProject(project) {
    const projects = await this.getProjects();
    const newProject = {
      id: this.generateId(),
      ...project,
      createdAt: new Date().toISOString()
    };
    projects.push(newProject);
    await this.writeFile('projects.json', projects);
    return newProject;
  }

  async updateProject(id, projectData) {
    const projects = await this.getProjects();
    const index = projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    projects[index] = { ...projects[index], ...projectData, updatedAt: new Date().toISOString() };
    await this.writeFile('projects.json', projects);
    return projects[index];
  }

  async deleteProject(id) {
    const projects = await this.getProjects();
    const filteredProjects = projects.filter(project => project.id !== id);
    if (projects.length === filteredProjects.length) {
      throw new Error('Project not found');
    }
    await this.writeFile('projects.json', filteredProjects);
    return true;
  }

  // Assignment operations
  async getAssignments() {
    return await this.readFile('assignments.json');
  }

  async saveAssignment(assignment) {
    const assignments = await this.getAssignments();
    const newAssignment = {
      id: this.generateId(),
      ...assignment,
      createdAt: new Date().toISOString()
    };
    assignments.push(newAssignment);
    await this.writeFile('assignments.json', assignments);
    return newAssignment;
  }

  async updateAssignment(id, assignmentData) {
    const assignments = await this.getAssignments();
    const index = assignments.findIndex(assignment => assignment.id === id);
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    assignments[index] = { ...assignments[index], ...assignmentData, updatedAt: new Date().toISOString() };
    await this.writeFile('assignments.json', assignments);
    return assignments[index];
  }

  async deleteAssignment(id) {
    const assignments = await this.getAssignments();
    const filteredAssignments = assignments.filter(assignment => assignment.id !== id);
    if (assignments.length === filteredAssignments.length) {
      throw new Error('Assignment not found');
    }
    await this.writeFile('assignments.json', filteredAssignments);
    return true;
  }

  // Utility method to generate IDs
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get assignment by employee and month for capacity planning
  async getAssignmentsByEmployeeAndMonth(employeeId, year, month) {
    const assignments = await this.getAssignments();
    return assignments.filter(assignment => 
      assignment.employeeId === employeeId && 
      assignment.year === year && 
      assignment.month === month
    );
  }

  // Get all assignments for a specific month
  async getAssignmentsByMonth(year, month) {
    const assignments = await this.getAssignments();
    return assignments.filter(assignment => 
      assignment.year === year && 
      assignment.month === month
    );
  }
}

module.exports = new DataService();