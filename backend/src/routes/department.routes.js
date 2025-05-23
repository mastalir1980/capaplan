const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');

// Get all departments
router.get('/', departmentController.getAllDepartments);

// Get department tree (can be from root or specific department)
router.get('/tree/:id?', departmentController.getDepartmentTree);

// Get department by ID
router.get('/:id', departmentController.getDepartmentById);

// Create new department
router.post('/', departmentController.createDepartment);

// Update department
router.put('/:id', departmentController.updateDepartment);

// Delete department
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;
