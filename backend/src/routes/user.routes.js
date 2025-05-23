const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Get all users (with optional department filter)
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create new user
router.post('/', userController.createUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
