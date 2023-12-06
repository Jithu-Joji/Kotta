const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  groupName: { type: String, ref: 'Cart' },
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);
module.exports = User;



