const User = require('../models/user.model');
const Department = require('../models/department.model');
const mongoose = require('mongoose');

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get department tree
exports.getDepartmentTree = async (req, res) => {
  try {
    const rootId = req.params.id || null;
    const tree = await Department.getTree(rootId);
    res.status(200).json(tree);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create department
exports.createDepartment = async (req, res) => {
  try {
    // Validate parent department if provided
    if (req.body.parentId) {
      const parentExists = await Department.findById(req.body.parentId);
      if (!parentExists) {
        return res.status(400).json({ message: 'Parent department not found' });
      }
    }

    const department = new Department({
      name: req.body.name,
      description: req.body.description,
      parentId: req.body.parentId || null
    });

    const newDepartment = await department.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    // Validate parent department if provided
    if (req.body.parentId) {
      // Prevent circular reference
      if (req.body.parentId === req.params.id) {
        return res.status(400).json({ message: 'Department cannot be its own parent' });
      }
      
      const parentExists = await Department.findById(req.body.parentId);
      if (!parentExists) {
        return res.status(400).json({ message: 'Parent department not found' });
      }
    }

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.name = req.body.name || department.name;
    department.description = req.body.description || department.description;
    department.parentId = req.body.parentId || department.parentId;

    const updatedDepartment = await department.save();
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    // Check if department has children
    const children = await Department.find({ parentId: req.params.id });
    if (children.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with child departments. Remove child departments first.' 
      });
    }

    // Check if department has users
    const users = await User.find({ departmentId: req.params.id });
    if (users.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with assigned users. Reassign users first.' 
      });
    }

    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
