const express = require('express');
const router = express.Router();
const adminController = require('../../../controllers/admin/auth.controller');

// Routes
router.get('/', adminController.getHomePage);  // For Checking

module.exports = router;