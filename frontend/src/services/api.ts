import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Employee API calls
export const getEmployees = async () => {
  return axios.get(`${API_URL}/employees`);
};

export const getEmployeeById = async (id: string) => {
  return axios.get(`${API_URL}/employees/${id}`);
};

export const createEmployee = async (employeeData: any) => {
  return axios.post(`${API_URL}/employees`, employeeData);
};

export const updateEmployee = async (id: string, employeeData: any) => {
  return axios.put(`${API_URL}/employees/${id}`, employeeData);
};

export const deleteEmployee = async (id: string) => {
  return axios.delete(`${API_URL}/employees/${id}`);
};

// Team API calls
export const getTeams = async () => {
  return axios.get(`${API_URL}/teams`);
};

export const getTeamById = async (id: string) => {
  return axios.get(`${API_URL}/teams/${id}`);
};

export const getTeamHierarchy = async (id: string) => {
  return axios.get(`${API_URL}/teams/${id}/hierarchy`);
};

export const createTeam = async (teamData: any) => {
  return axios.post(`${API_URL}/teams`, teamData);
};

export const updateTeam = async (id: string, teamData: any) => {
  return axios.put(`${API_URL}/teams/${id}`, teamData);
};

export const deleteTeam = async (id: string) => {
  return axios.delete(`${API_URL}/teams/${id}`);
};

// Project API calls
export const getProjects = async () => {
  return axios.get(`${API_URL}/projects`);
};

export const getProjectById = async (id: string) => {
  return axios.get(`${API_URL}/projects/${id}`);
};

export const createProject = async (projectData: any) => {
  return axios.post(`${API_URL}/projects`, projectData);
};

export const updateProject = async (id: string, projectData: any) => {
  return axios.put(`${API_URL}/projects/${id}`, projectData);
};

export const deleteProject = async (id: string) => {
  return axios.delete(`${API_URL}/projects/${id}`);
};

// Assignment API calls
export const getAssignments = async () => {
  return axios.get(`${API_URL}/assignments`);
};

export const getAssignmentsByProject = async (projectId: string) => {
  return axios.get(`${API_URL}/assignments/project/${projectId}`);
};

export const getAssignmentsByEmployee = async (employeeId: string) => {
  return axios.get(`${API_URL}/assignments/employee/${employeeId}`);
};

export const getAssignmentsByTeam = async (teamId: string) => {
  return axios.get(`${API_URL}/assignments/team/${teamId}`);
};

export const createAssignment = async (assignmentData: any) => {
  return axios.post(`${API_URL}/assignments`, assignmentData);
};

export const updateAssignment = async (id: string, assignmentData: any) => {
  return axios.put(`${API_URL}/assignments/${id}`, assignmentData);
};

export const deleteAssignment = async (id: string) => {
  return axios.delete(`${API_URL}/assignments/${id}`);
};
