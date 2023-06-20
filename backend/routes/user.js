const express = require('express');
const {
  getUsers,
  signupUser,
  loginUser,
  deleteUser,
  editUserRole,
} = require('../controllers/userController');

const router = express.Router();

// GET all users
router.get('/', getUsers);

// Login Route
router.post('/login', loginUser);

// Signup Route
router.post('/signup', signupUser);

// Delete User Route
router.delete('/:userId', deleteUser);

// Edit User Role Route
router.put('/:userId', editUserRole);

module.exports = router;
