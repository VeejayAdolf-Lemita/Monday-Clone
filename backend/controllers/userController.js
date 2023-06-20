const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { uuid } = require('uuidv4');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '30d' });
};

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup User
const signupUser = async (req, res) => {
  const { email, password, isAdmin } = req.body;

  try {
    const id = uuid();
    const user = await User.signup(id, email, password, isAdmin);

    // Create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Edit User Role
const editUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit user role' });
  }
};

module.exports = {
  getUsers,
  signupUser,
  loginUser,
  deleteUser,
  editUserRole,
};
