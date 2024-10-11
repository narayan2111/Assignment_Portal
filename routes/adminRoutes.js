const express = require('express');
const AdminController = require('../controllers/admincontroller');

const router = express.Router();

// Middleware to check if the admin is authenticated
function isAdminAuthenticated(req, res, next) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');  // Redirect to login if not authenticated
    }
    next();
}

// Routes with middleware for protected routes
router.get('/form', AdminController.renderAdminForm);
router.post('/submit', AdminController.submitAdminSignup);
router.get('/login', AdminController.renderAdminLogin);
router.post('/login', AdminController.loginAdmin);
router.get('/dashboard', isAdminAuthenticated, AdminController.renderAdminDashboard);
router.post('/assignments/:assignmentId/accept', isAdminAuthenticated, AdminController.acceptAssignment);
router.post('/assignments/:assignmentId/reject', isAdminAuthenticated, AdminController.rejectAssignment);
router.get('/logout', AdminController.logoutAdmin);

module.exports = router;
