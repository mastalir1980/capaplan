const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET all assignments
router.get('/', async (req, res) => {
  try {
    const { year, month, employeeId, projectId } = req.query;
    let assignments = await dataService.getAssignments();
    
    // Filter by query parameters
    if (year && month) {
      assignments = assignments.filter(assignment => 
        assignment.year === parseInt(year) && 
        assignment.month === parseInt(month)
      );
    }
    
    if (employeeId) {
      assignments = assignments.filter(assignment => assignment.employeeId === employeeId);
    }
    
    if (projectId) {
      assignments = assignments.filter(assignment => assignment.projectId === projectId);
    }
    
    res.status(200).json({
      status: 'success',
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET assignments by project ID
router.get('/project/:projectId', async (req, res) => {
  try {
    const assignments = await dataService.getAssignments();
    const projectAssignments = assignments.filter(assignment => assignment.projectId === req.params.projectId);
    
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

// GET assignments by employee ID
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const assignments = await dataService.getAssignments();
    const employeeAssignments = assignments.filter(assignment => assignment.employeeId === req.params.employeeId);
    
    res.status(200).json({
      status: 'success',
      data: employeeAssignments
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET assignments by team ID
router.get('/team/:teamId', async (req, res) => {
  try {
    const employees = await dataService.getEmployees();
    const teamMembers = employees.filter(emp => emp.teamId === req.params.teamId);
    const assignments = await dataService.getAssignments();
    
    const teamAssignments = assignments.filter(assignment => 
      teamMembers.some(member => member.id === assignment.employeeId)
    );
    
    res.status(200).json({
      status: 'success',
      data: teamAssignments
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST create new assignment
router.post('/', async (req, res) => {
  try {
    const { employeeId, projectId, year, month, fteAllocation, description } = req.body;
    
    // Basic validation
    if (!employeeId || !projectId || !year || !month || fteAllocation === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Employee ID, Project ID, year, month, and FTE allocation are required'
      });
    }
    
    // Validate FTE allocation is between 0 and 1
    if (fteAllocation < 0 || fteAllocation > 1) {
      return res.status(400).json({
        status: 'error',
        message: 'FTE allocation must be between 0 and 1'
      });
    }
    
    // Check if employee exists
    const employees = await dataService.getEmployees();
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      return res.status(400).json({
        status: 'error',
        message: 'Employee not found'
      });
    }
    
    // Check if project exists
    const projects = await dataService.getProjects();
    const project = projects.find(proj => proj.id === projectId);
    if (!project) {
      return res.status(400).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    // Check total FTE allocation for employee in this month doesn't exceed 1
    const existingAssignments = await dataService.getAssignmentsByEmployeeAndMonth(employeeId, year, month);
    const totalFTE = existingAssignments.reduce((sum, assignment) => sum + assignment.fteAllocation, 0);
    
    if (totalFTE + fteAllocation > 1) {
      return res.status(400).json({
        status: 'error',
        message: `Total FTE allocation for employee in ${month}/${year} would exceed 100%. Current: ${Math.round(totalFTE * 100)}%, Requested: ${Math.round(fteAllocation * 100)}%`
      });
    }
    
    const newAssignment = await dataService.saveAssignment({
      employeeId,
      projectId,
      year: parseInt(year),
      month: parseInt(month),
      fteAllocation: parseFloat(fteAllocation),
      description: description || ''
    });
    
    res.status(201).json({
      status: 'success',
      data: newAssignment
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT update assignment
router.put('/:id', async (req, res) => {
  try {
    const { employeeId, projectId, year, month, fteAllocation, description } = req.body;
    
    const updatedAssignment = await dataService.updateAssignment(req.params.id, {
      employeeId,
      projectId,
      year: year ? parseInt(year) : undefined,
      month: month ? parseInt(month) : undefined,
      fteAllocation: fteAllocation ? parseFloat(fteAllocation) : undefined,
      description
    });
    
    res.status(200).json({
      status: 'success',
      data: updatedAssignment
    });
  } catch (error) {
    const statusCode = error.message === 'Assignment not found' ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE assignment
router.delete('/:id', async (req, res) => {
  try {
    await dataService.deleteAssignment(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'Assignment not found' ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET capacity overview for a specific month
router.get('/capacity/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const assignments = await dataService.getAssignmentsByMonth(parseInt(year), parseInt(month));
    const employees = await dataService.getEmployees();
    const projects = await dataService.getProjects();
    
    // Build capacity overview
    const capacityOverview = employees.map(employee => {
      const employeeAssignments = assignments.filter(assignment => assignment.employeeId === employee.id);
      const totalFTE = employeeAssignments.reduce((sum, assignment) => sum + assignment.fteAllocation, 0);
      
      const assignmentDetails = employeeAssignments.map(assignment => {
        const project = projects.find(p => p.id === assignment.projectId);
        return {
          ...assignment,
          projectName: project ? project.name : 'Unknown Project'
        };
      });
      
      return {
        employee,
        totalFTE,
        availableFTE: 1 - totalFTE,
        assignments: assignmentDetails,
        isOverloaded: totalFTE > 1
      };
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        year: parseInt(year),
        month: parseInt(month),
        capacityOverview
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
