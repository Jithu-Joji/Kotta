const express = require('express');
const router = express.Router();
const { loginUser, authenticateUser, changePassword } = require('../controllers/authController');
const { createUser } = require('../controllers/userController');

// Route for user login
router.post('/login', loginUser);

// Route for user signup
router.post('/signup', createUser);

// Middleware to authenticate routes
router.use(authenticateUser);

// Route for changing user password (assuming this route requires authentication)
router.post('/change-password', changePassword);

// Other authentication-related routes...

module.exports = router;
