const express = require('express');
const { getUsers, signupUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// GET all users
router.get('/', getUsers);

// Login Route
router.post('/login', loginUser);

// Signup Route
router.post('/signup', signupUser);

module.exports = router;
