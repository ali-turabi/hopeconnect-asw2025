// routes/orphanRoutes.js
const express = require('express');
const router = express.Router();

// Middleware
const verifyAdminStaff = require('../middleware/verifyAdminStaff');
const verifyAnyStaff = require('../middleware/verifyAnyStaff');
const { authenticate, authorizeAdmin, authorizeSponsor } = require('../middleware/auth');


// Controllers
const {
  addOrphan,
  getAllOrphans,
  getOrphan,
  toggleActiveStatus,
  deleteOrphan,
  updateOrphanAdmin,
  getNonSponsoredOrphans,
} = require('../controllers/orphanController');

// Routes (Order matters!)
router.get('/', verifyAnyStaff, (req, res) => {
    res.redirect('/api/orphans/all'); // Redirect to /all
    // OR provide a different response
});
// In your orphanRoutes.js
router.get(
  '/available', 
  authenticate, 
  authorizeSponsor,  // Use the new combined middleware
  getNonSponsoredOrphans
);router.post('/add', verifyAdminStaff, addOrphan);
router.get('/all', verifyAnyStaff, getAllOrphans);
router.get('/:id', verifyAnyStaff, getOrphan);
router.patch('/:id/status', verifyAdminStaff, toggleActiveStatus);
router.delete('/:id', verifyAdminStaff, deleteOrphan);
router.put('/:id', verifyAdminStaff, updateOrphanAdmin);

module.exports = router;
