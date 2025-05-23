const express = require('express');
const router = express.Router();

// GET all employees
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all employees endpoint' });
});

// GET employee by ID
router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get employee with ID: ${req.params.id}` });
});

// POST create new employee
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create new employee endpoint', data: req.body });
});

// PUT update employee
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update employee with ID: ${req.params.id}`, data: req.body });
});

// DELETE employee
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete employee with ID: ${req.params.id}` });
});

module.exports = router;
