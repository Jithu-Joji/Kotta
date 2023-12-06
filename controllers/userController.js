const User = require('../models/userModel');
const bcrypt = require('bcrypt');


async function createUser(req, res) {
  const { email, password, groupName, userType } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = new User({
      email,
      password: hashedPassword, // Save hashed password
      userType,
      groupName,
    });

    const user = await newUser.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
}

function getUserDetails(req, res) {
  const userId = req.params.id; // Assuming you pass the user ID in the URL

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error fetching user details', error });
    });
}

function updateUserDetails(req, res) {
  const userId = req.params.id;
  const updatedInfo = req.body; // New details to update

  User.findByIdAndUpdate(userId, updatedInfo, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User details updated', user });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error updating user details', error });
    });
}

function deleteUser(req, res) {
  const userId = req.params.id;

  User.findByIdAndDelete(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error deleting user', error });
    });
}

// Other user-related functions...

module.exports = {
  createUser,
  getUserDetails,
  updateUserDetails,
  deleteUser,
  // Other exported functions...
};
