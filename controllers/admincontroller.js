const Admin = require('../models/adminModel.js');
const Assignment = require('../models/assignmentModel.js');

// Middleware to check if the admin is authenticated
function isAdminAuthenticated(req, res, next) {
    if (!req.session.admin) {
        return res.redirect('/admin/login');  // Redirect to login if not authenticated
    }
    next();
}

// Admin registration form route
exports.renderAdminForm = (req, res) => {
    res.render('adminForm');  // Render 'adminForm.ejs'
};

// Admin registration submission
exports.submitAdminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the admin with the given email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.render('adminForm', {
                errorMessage: 'Admin with this email already exists!' // Display error message
            });
        }

        const newAdmin = new Admin({
            name,
            email,
            password,
            role: 'admin'  // Default role as admin
        });

        await newAdmin.save();

        // Redirect to login page with a success message
        res.render('adminLogin', { successMessage: 'Admin account created successfully! Please log in.' });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).send('Error creating admin');
    }
};

// Admin login form route
exports.renderAdminLogin = (req, res) => {
    res.render('adminLogin.ejs', { error: null });
};

// Admin login submission
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin || admin.password !== password) {
            return res.render('adminLogin', {
                errorMessage: 'Invalid email or password'  // Display error message on login failure
            });
        }

        // Store admin in session
        req.session.admin = admin;

        // Redirect to admin dashboard on successful login
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).send('Internal server error');
    }
};

// Admin dashboard route (requires authentication)
exports.renderAdminDashboard = async (req, res) => {
    // Check if the admin is authenticated
    if (!req.session.admin) {
        return res.redirect('/admin/login');  // Ensure admin is logged in
    }

    try {
        const admin = req.session.admin;
        const assignments = await Assignment.find({ adminId: admin._id }).populate('userId', 'name email');

        res.render('adminDashboard', { admin, assignments });
    } catch (error) {
        console.error('Error fetching admin details:', error);
        res.status(500).send('Error loading admin details');
    }
};

// Accept assignment route (requires authentication)
exports.acceptAssignment = async (req, res) => {
    // Check if the admin is authenticated
    if (!req.session.admin) {
        return res.redirect('/admin/login');  // Ensure admin is logged in
    }

    const { assignmentId } = req.params;

    try {
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'accepted' });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error accepting assignment:', error);
        res.status(500).send('Error accepting assignment');
    }
};

// Reject assignment route (requires authentication)
exports.rejectAssignment = async (req, res) => {
    // Check if the admin is authenticated
    if (!req.session.admin) {
        return res.redirect('/admin/login');  // Ensure admin is logged in
    }

    const { assignmentId } = req.params;

    try {
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'rejected' });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error rejecting assignment:', error);
        res.status(500).send('Error rejecting assignment');
    }
};

// Admin logout route
exports.logoutAdmin = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/admin/login');
    });
};
