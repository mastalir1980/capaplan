// Test script for user and department API endpoints
const axios = require('axios');
const baseUrl = 'http://localhost:5000/api';

// Test department endpoints
async function testDepartmentEndpoints() {
  console.log('Testing department endpoints...');
  
  try {
    // Create root department
    console.log('Creating root department...');
    const rootDept = await axios.post(`${baseUrl}/departments`, {
      name: 'Company Headquarters',
      description: 'Main company department'
    });
    console.log('Root department created:', rootDept.data);
    
    // Create child department
    console.log('Creating child department...');
    const childDept = await axios.post(`${baseUrl}/departments`, {
      name: 'IT Department',
      description: 'Information Technology',
      parentId: rootDept.data._id
    });
    console.log('Child department created:', childDept.data);
    
    // Get all departments
    console.log('Getting all departments...');
    const allDepts = await axios.get(`${baseUrl}/departments`);
    console.log('All departments:', allDepts.data);
    
    // Get department tree
    console.log('Getting department tree...');
    const deptTree = await axios.get(`${baseUrl}/departments/tree`);
    console.log('Department tree:', JSON.stringify(deptTree.data, null, 2));
    
    // Update department
    console.log('Updating department...');
    const updatedDept = await axios.put(`${baseUrl}/departments/${childDept.data._id}`, {
      name: 'IT and Development Department',
      description: 'Information Technology and Software Development'
    });
    console.log('Updated department:', updatedDept.data);
    
    return {
      rootDeptId: rootDept.data._id,
      childDeptId: childDept.data._id
    };
  } catch (error) {
    console.error('Error testing department endpoints:', error.response?.data || error.message);
    throw error;
  }
}

// Test user endpoints
async function testUserEndpoints(deptIds) {
  console.log('Testing user endpoints...');
  
  try {
    // Create user in root department
    console.log('Creating user in root department...');
    const rootUser = await axios.post(`${baseUrl}/users`, {
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'CEO',
      departmentId: deptIds.rootDeptId
    });
    console.log('Root user created:', rootUser.data);
    
    // Create user in child department
    console.log('Creating user in child department...');
    const childUser = await axios.post(`${baseUrl}/users`, {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'IT Director',
      departmentId: deptIds.childDeptId
    });
    console.log('Child user created:', childUser.data);
    
    // Get all users
    console.log('Getting all users...');
    const allUsers = await axios.get(`${baseUrl}/users`);
    console.log('All users:', allUsers.data);
    
    // Get users by department
    console.log('Getting users by department...');
    const deptUsers = await axios.get(`${baseUrl}/users?departmentId=${deptIds.childDeptId}`);
    console.log('Department users:', deptUsers.data);
    
    // Update user
    console.log('Updating user...');
    const updatedUser = await axios.put(`${baseUrl}/users/${childUser.data._id}`, {
      position: 'IT Director & CTO'
    });
    console.log('Updated user:', updatedUser.data);
    
    return {
      rootUserId: rootUser.data._id,
      childUserId: childUser.data._id
    };
  } catch (error) {
    console.error('Error testing user endpoints:', error.response?.data || error.message);
    throw error;
  }
}

// Test deletion
async function testDeletion(deptIds, userIds) {
  console.log('Testing deletion...');
  
  try {
    // Try to delete department with users (should fail)
    console.log('Trying to delete department with users (should fail)...');
    try {
      await axios.delete(`${baseUrl}/departments/${deptIds.childDeptId}`);
    } catch (error) {
      console.log('Expected error:', error.response.data);
    }
    
    // Delete users
    console.log('Deleting users...');
    await axios.delete(`${baseUrl}/users/${userIds.rootUserId}`);
    await axios.delete(`${baseUrl}/users/${userIds.childUserId}`);
    console.log('Users deleted successfully');
    
    // Now delete departments
    console.log('Deleting departments...');
    await axios.delete(`${baseUrl}/departments/${deptIds.childDeptId}`);
    await axios.delete(`${baseUrl}/departments/${deptIds.rootDeptId}`);
    console.log('Departments deleted successfully');
  } catch (error) {
    console.error('Error testing deletion:', error.response?.data || error.message);
    throw error;
  }
}

// Run all tests
async function runTests() {
  try {
    const deptIds = await testDepartmentEndpoints();
    const userIds = await testUserEndpoints(deptIds);
    await testDeletion(deptIds, userIds);
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test suite failed:', error);
  }
}

// Run the tests
runTests();
