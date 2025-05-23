const express = require('express');
const router = express.Router();

// GET all projects
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all projects endpoint' });
});

// GET project by ID
router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get project with ID: ${req.params.id}` });
});

// POST create new project
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create new project endpoint', data: req.body });
});

// PUT update project
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update project with ID: ${req.params.id}`, data: req.body });
});

// DELETE project
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete project with ID: ${req.params.id}` });
});

module.exports = router;
