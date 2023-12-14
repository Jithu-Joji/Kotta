const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const secretKey = 'your-secret-key'; // Replace with your secret key

function loginUser(req, res) {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ username, userType: user.userType }, secretKey, {
          expiresIn: '1h',
        });
        return res.status(200).json({
          token,
          userId: user._id, 
          userType: user.userType,
          groupName: user.groupName,
          pname: user.pname,
          pimgUrl: user.pimgUrl
        });
      } else {
        return res.status(402).json({ message: 'Invalid password' });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: 'An error occurred', error });
    });
}

function authenticateUser(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    next();
  });
}

function changePassword(req, res) {
  const { username, newPassword } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      user.password = hashedPassword;

      user.save()
        .then(() => {
          return res.status(200).json({ message: 'Password updated successfully' });
        })
        .catch((error) => {
          console.error('Error updating password:', error);
          return res.status(500).json({ message: 'Error updating password', error });
        });
    })
    .catch((error) => {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'An error occurred', error });
    });
}

// Other authentication-related functions...

module.exports = {
  loginUser,
  authenticateUser,
  changePassword,
};
