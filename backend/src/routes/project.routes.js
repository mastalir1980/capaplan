const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await dataService.getProjects();
    res.status(200).json({
      status: 'success',
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET project by ID
router.get('/:id', async (req, res) => {
  try {
    const projects = await dataService.getProjects();
    const project = projects.find(proj => proj.id === req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST create new project
router.post('/', async (req, res) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;
    
    // Basic validation
    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Project name, start date, and end date are required'
      });
    }
    
    const newProject = await dataService.saveProject({
      name,
      description: description || '',
      startDate,
      endDate,
      status: status || 'planning'
    });
    
    res.status(201).json({
      status: 'success',
      data: newProject
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;
    
    const updatedProject = await dataService.updateProject(req.params.id, {
      name,
      description,
      startDate,
      endDate,
      status
    });
    
    res.status(200).json({
      status: 'success',
      data: updatedProject
    });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await dataService.deleteProject(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET project assignments
router.get('/:id/assignments', async (req, res) => {
  try {
    const assignments = await dataService.getAssignments();
    const projectAssignments = assignments.filter(assignment => assignment.projectId === req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: projectAssignments
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
