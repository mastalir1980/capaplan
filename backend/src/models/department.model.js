const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null
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
departmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get all children departments
departmentSchema.methods.getChildren = async function() {
  return await mongoose.model('Department').find({ parentId: this._id });
};

// Static method to get full tree starting from a department
departmentSchema.statics.getTree = async function(rootId = null) {
  const departments = await this.find({});
  
  // Function to build tree recursively
  const buildTree = (parentId) => {
    return departments
      .filter(dept => 
        parentId === null 
          ? dept.parentId === null 
          : dept.parentId && dept.parentId.toString() === parentId.toString()
      )
      .map(dept => ({
        ...dept.toObject(),
        children: buildTree(dept._id)
      }));
  };

  return rootId 
    ? buildTree(rootId) 
    : buildTree(null);
};

module.exports = mongoose.model('Department', departmentSchema);
