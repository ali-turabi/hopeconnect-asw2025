const express = require('express');
const router = express.Router();
const { createReport } = require('../controllers/reportController');
const verifyAnyStaff = require('../middleware/verifyAnyStaff');

router.post('/', verifyAnyStaff, createReport);

module.exports = router;