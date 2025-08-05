const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

// Načtení dat z JSON souboru
const loadData = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};

// Uložení dat do JSON souboru
const saveData = async (data) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

// Získání uživatelů
const getUsers = async (filter = {}) => {
  const data = await loadData();
  let users = data.users;
  
  if (filter.departmentId) {
    users = users.filter(user => user.departmentId === filter.departmentId);
  }
  
  return users;
};

// Získání uživatele podle ID
const getUserById = async (id) => {
  const data = await loadData();
  return data.users.find(user => user._id === id);
};

// Přidání nového uživatele
const addUser = async (userData) => {
  const data = await loadData();
  
  // Vygenerování nového ID
  const newId = `673d5f8a1234567890abcd${data.counters.nextUserId++}`;
  
  const newUser = {
    _id: newId,
    ...userData
  };
  
  data.users.push(newUser);
  await saveData(data);
  
  return newUser;
};

// Aktualizace uživatele
const updateUser = async (id, userData) => {
  const data = await loadData();
  const userIndex = data.users.findIndex(user => user._id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  data.users[userIndex] = { ...data.users[userIndex], ...userData };
  await saveData(data);
  
  return data.users[userIndex];
};

// Smazání uživatele
const deleteUser = async (id) => {
  const data = await loadData();
  const userIndex = data.users.findIndex(user => user._id === id);
  
  if (userIndex === -1) {
    return false;
  }
  
  data.users.splice(userIndex, 1);
  await saveData(data);
  
  return true;
};

// Získání oddělení
const getDepartments = async () => {
  const data = await loadData();
  return data.departments;
};

// Získání oddělení podle ID
const getDepartmentById = async (id) => {
  const data = await loadData();
  return data.departments.find(dept => dept._id === id);
};

// Přidání nového oddělení
const addDepartment = async (deptData) => {
  const data = await loadData();
  
  // Vygenerování nového ID
  const newId = `673d5f8a1234567890abcd${data.counters.nextDepartmentId++}`;
  
  const newDepartment = {
    _id: newId,
    ...deptData
  };
  
  data.departments.push(newDepartment);
  await saveData(data);
  
  return newDepartment;
};

// Kontrola existence emailu
const emailExists = async (email, excludeId = null) => {
  const data = await loadData();
  return data.users.some(user => user.email === email && user._id !== excludeId);
};

module.exports = {
  loadData,
  saveData,
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getDepartments,
  getDepartmentById,
  addDepartment,
  emailExists
};
