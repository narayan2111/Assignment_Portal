const express = require('express');
const Admin = require('../models/adminModel.js');
const Assignment = require('../models/assignmentModel.js');

const router = express.Router();

router.get('/form', (req, res) => {
    res.render('adminForm');  // Render the 'adminForm.ejs' template
});

router.post('/submit', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Create a new admin object
        const newAdmin = new Admin({
            name,
            email,
            password,
            role: 'admin'  // Role set to 'admin'
        });

        // Save the admin in the database
        await newAdmin.save();

        // Redirect to login page with success message
        res.render('login', { successMessage: 'Admin account created successfully! Please log in.' });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).send('Error creating admin');
    }
});


router.get('/login', (req, res) => {
    res.render('adminLogin.ejs', { error: null });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin || admin.password !== password) {
            return res.redirect(`/error?message=Invalid email or password`);
        }

        res.redirect(`/admin/dashboard?adminId=${admin._id}`);
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/dashboard', async (req, res) => {
    const adminId = req.query.adminId;

    if (!adminId) {
        return res.redirect('/admin/login');
    }

    try {
        const admin = await Admin.findById(adminId);
        const assignments = await Assignment.find({ adminId }).populate('userId', 'name email');

        res.render('adminDashboard', { admin, assignments });
    } catch (error) {
        console.error('Error fetching admin details:', error);
        res.status(500).send('Error loading admin details');
    }
});

router.post('/assignments/:assignmentId/accept', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'accepted' });
        res.redirect('/admin/dashboard?adminId=' + req.query.adminId);
    } catch (error) {
        console.error('Error accepting assignment:', error);
        res.status(500).send('Error accepting assignment');
    }
});

router.post('/assignments/:assignmentId/reject', async (req, res) => {
    const { assignmentId } = req.params;

    try {
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'rejected' });
        res.redirect('/admin/dashboard?adminId=' + req.query.adminId);
    } catch (error) {
        console.error('Error rejecting assignment:', error);
        res.status(500).send('Error rejecting assignment');
    }
});



module.exports = router;
