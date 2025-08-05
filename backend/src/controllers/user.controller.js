const db = require('../data/jsonDatabase');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const filter = {};
    
    // Filter by department if provided
    if (req.query.departmentId) {
      filter.departmentId = req.query.departmentId;
    }
    
    const users = await db.getUsers(filter);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
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
    const departmentExists = await db.getDepartmentById(req.body.departmentId);
    if (!departmentExists) {
      return res.status(400).json({ message: 'Department not found' });
    }

    // Check if email already exists
    const emailAlreadyExists = await db.emailExists(req.body.email);
    if (emailAlreadyExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = await db.addUser({
      name: req.body.name,
      email: req.body.email,
      position: req.body.position,
      departmentId: req.body.departmentId
    });

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
      const departmentExists = await db.getDepartmentById(req.body.departmentId);
      if (!departmentExists) {
        return res.status(400).json({ message: 'Department not found' });
      }
    }

    // Check if email already exists (if email is being updated)
    if (req.body.email) {
      const emailAlreadyExists = await db.emailExists(req.body.email, req.params.id);
      if (emailAlreadyExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await db.updateUser(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      position: req.body.position,
      departmentId: req.body.departmentId
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await db.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
