const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET all teams
router.get('/', async (req, res) => {
  try {
    const teams = await dataService.getTeams();
    res.status(200).json({
      status: 'success',
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET team by ID
router.get('/:id', async (req, res) => {
  try {
    const teams = await dataService.getTeams();
    const team = teams.find(team => team.id === req.params.id);
    
    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: team
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET team hierarchy
router.get('/:id/hierarchy', async (req, res) => {
  try {
    const teams = await dataService.getTeams();
    const employees = await dataService.getEmployees();
    
    const buildHierarchy = (teamId) => {
      const team = teams.find(t => t.id === teamId);
      if (!team) return null;
      
      const subTeams = teams.filter(t => t.parentTeamId === teamId);
      const teamMembers = employees.filter(emp => emp.teamId === teamId);
      
      return {
        ...team,
        subTeams: subTeams.map(subTeam => buildHierarchy(subTeam.id)),
        members: teamMembers
      };
    };
    
    const hierarchy = buildHierarchy(req.params.id);
    
    if (!hierarchy) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: hierarchy
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST create new team
router.post('/', async (req, res) => {
  try {
    const { name, description, parentTeamId } = req.body;
    
    // Basic validation
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Team name is required'
      });
    }
    
    const newTeam = await dataService.saveTeam({
      name,
      description: description || '',
      parentTeamId: parentTeamId || null
    });
    
    res.status(201).json({
      status: 'success',
      data: newTeam
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT update team
router.put('/:id', async (req, res) => {
  try {
    const { name, description, parentTeamId } = req.body;
    
    const updatedTeam = await dataService.updateTeam(req.params.id, {
      name,
      description,
      parentTeamId
    });
    
    res.status(200).json({
      status: 'success',
      data: updatedTeam
    });
  } catch (error) {
    const statusCode = error.message === 'Team not found' ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE team
router.delete('/:id', async (req, res) => {
  try {
    await dataService.deleteTeam(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Team deleted successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'Team not found' ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET team members
router.get('/:id/members', async (req, res) => {
  try {
    const employees = await dataService.getEmployees();
    const teamMembers = employees.filter(emp => emp.teamId === req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: teamMembers
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
