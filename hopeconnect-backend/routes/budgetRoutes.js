const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
// Get current budget
router.get('/budget',authenticate, authorizeAdmin,
 budgetController.getBudget);

// Update budget (add/subtract)
router.patch('/budget',authenticate, authorizeAdmin
, budgetController.updateBudget);

module.exports = router;