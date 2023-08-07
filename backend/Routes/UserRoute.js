const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController')
//ROUTES
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

module.exports = router;
