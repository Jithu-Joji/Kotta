const express = require('express');
const router = express.Router();
const { createUser, getUserDetails, updateUserDetails, deleteUser } = require('../controllers/userController');

// Route to create a new user
router.post('/create', createUser);

// Route to get user details by ID
router.get('/:id', getUserDetails);

// Route to update user details by ID
router.put('/:id', updateUserDetails);

// Route to delete user by ID
router.delete('/:id', deleteUser);

// Other user-related routes...

module.exports = router;
