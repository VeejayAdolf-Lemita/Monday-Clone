const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
});

userSchema.statics.signup = async function (id, email, password, isAdmin = false) {
  // validation
  if (!email || !password) {
    throw Error('All field must be field');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password must contain (uppercase"A",lowercase"a",number"1", symbol"!")');
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const role = isAdmin ? 'admin' : 'user';

  const user = await this.create({ email, password: hash, id, role });

  return user;
};

// Static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error('Incorrect Email');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Incorrect Password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
