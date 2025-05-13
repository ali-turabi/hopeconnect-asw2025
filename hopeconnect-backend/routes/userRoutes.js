const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', UserController.login);
router.post('/signup', UserController.signup);

// Protected routes
router.get('/:id', authenticate, UserController.getUserById);
router.put('/:id', authenticate, UserController.updateUser);

// Admin-only routes
router.get('/', authenticate, authorizeAdmin, UserController.getAllUsers);
router.post('/staff', authenticate, authorizeAdmin, UserController.createStaff);
// In routes/userRoutes.js add this route
router.delete('/:id', authenticate, authorizeAdmin, UserController.deleteUser);
module.exports = router;
