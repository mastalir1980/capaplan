const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get user's department
userSchema.methods.getDepartment = async function() {
  return await mongoose.model('Department').findById(this.departmentId);
};

// Static method to find users by department
userSchema.statics.findByDepartment = async function(departmentId) {
  return await this.find({ departmentId }).populate('departmentId');
};

module.exports = mongoose.model('User', userSchema);
