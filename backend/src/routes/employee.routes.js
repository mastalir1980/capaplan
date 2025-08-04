const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await dataService.getEmployees();
    res.status(200).json({
      status: 'success',
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employees = await dataService.getEmployees();
    const employee = employees.find(emp => emp.id === req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST create new employee
router.post('/', async (req, res) => {
  try {
    const { name, email, position, teamId } = req.body;
    
    // Basic validation
    if (!name || !email || !position) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and position are required'
      });
    }
    
    const newEmployee = await dataService.saveEmployee({
      name,
      email,
      position,
      teamId: teamId || null
    });
    
    res.status(201).json({
      status: 'success',
      data: newEmployee
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  try {
    const { name, email, position, teamId } = req.body;
    
    const updatedEmployee = await dataService.updateEmployee(req.params.id, {
      name,
      email,
      position,
      teamId
    });
    
    res.status(200).json({
      status: 'success',
      data: updatedEmployee
    });
  } catch (error) {
    const statusCode = error.message === 'Employee not found' ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    await dataService.deleteEmployee(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'Employee not found' ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
