const express = require('express');
const UserController = require('../controllers/usercontroller');

const router = express.Router();

// routes
router.get('/login', UserController.renderLogin);
router.get('/form', UserController.renderSignupForm);
router.post('/submit', UserController.submitSignup);
router.post('/login', UserController.submitLogin);
router.get('/dashboard', UserController.renderDashboard);
router.get('/logout', UserController.logout);
router.post('/assignment/submit', UserController.submitAssignment);

module.exports = router;
