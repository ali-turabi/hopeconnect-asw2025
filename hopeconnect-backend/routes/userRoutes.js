const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', UserController.login);
router.post('/signup', UserController.signup);

// Staff routes (admin only)
router.post('/staff', authenticate, authorizeAdmin, UserController.createStaff);
router.get('/staff', authenticate, authorizeAdmin, UserController.getAllStaff);
router.get('/staff/:id', authenticate, authorizeAdmin, UserController.getStaffById);
router.put('/staff/:id', authenticate, authorizeAdmin, UserController.updateStaff);
router.delete('/staff/:id', authenticate, authorizeAdmin, UserController.deleteStaff);

// User routes
router.get('/:id', authenticate, UserController.getUserById);
router.put('/:id', authenticate, UserController.updateUser);
router.delete('/:id', authenticate, authorizeAdmin, UserController.deleteUser);
router.get('/', authenticate, authorizeAdmin, UserController.getAllUsers);

module.exports = router;