const User = require('../models/user.model');
const Department = require('../models/department.model');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const query = {};
    
    // Filter by department if provided
    if (req.query.departmentId) {
      query.departmentId = req.query.departmentId;
    }
    
    const users = await User.find(query).populate('departmentId');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('departmentId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    // Validate department
    const departmentExists = await Department.findById(req.body.departmentId);
    if (!departmentExists) {
      return res.status(400).json({ message: 'Department not found' });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      position: req.body.position,
      departmentId: req.body.departmentId
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Validate department if provided
    if (req.body.departmentId) {
      const departmentExists = await Department.findById(req.body.departmentId);
      if (!departmentExists) {
        return res.status(400).json({ message: 'Department not found' });
      }
    }

    // Check if email already exists (if email is being updated)
    if (req.body.email) {
      const emailExists = await User.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id }
      });
      
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.position = req.body.position || user.position;
    user.departmentId = req.body.departmentId || user.departmentId;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
