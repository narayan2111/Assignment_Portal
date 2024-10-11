const User = require('../models/users.js');
const Admin = require('../models/adminModel.js');
const Assignment = require('../models/assignmentModel.js');

// User login page
exports.renderLogin = (req, res) => {
    // If user is already logged in, redirect to dashboard
    if (req.session.user) {
        return res.redirect(`/user/dashboard`);
    }
    // Render login page
    res.render('login');
};

// User signup form route
exports.renderSignupForm = (req, res) => {
    res.render('userForm');  // Render 'userForm.ejs'
};

// User signup submission
// User signup submission
exports.submitSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('userForm', {
                errorMessage: 'Email already in use. Please choose another one.',  // Display error message if email is taken
                name: name,  // Preserve the name input
                email: email  // Preserve the email input
            });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: 'user'  // Default role as user
        });

        await newUser.save();

        // Redirect to login page with a success message
        res.render('login', { successMessage: 'Account created successfully! Please log in.' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
};


// User login route with session management
exports.submitLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.render('login', {
                errorMessage: 'Invalid email or password'  // Display error message on login failure
            });
        }
        // On successful login, store user info in session
        req.session.user = {
            id: user._id,
            email: user.email,
            name: user.name
        };
        // Redirect to dashboard
        res.redirect(`/user/dashboard`);
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).send('Internal server error');
    }
};

// User dashboard route (requires login)
exports.renderDashboard = async (req, res) => {
    // Check if user session exists and is valid
    if (!req.session || !req.session.user) {
        // If no session, redirect to the login page
        return res.redirect('/user/login');
    }
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const admins = await Admin.find({});
        const assignments = await Assignment.find({ userId: user._id }).populate('adminId'); // Populate adminId to get admin details
        res.render('userDashboard', { user, admins, assignments });
    } catch (error) {
        console.error('Error fetching user or admins:', error);
        res.status(500).send('Internal server error');
    }
};

// User logout route
exports.logout = (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session during logout:', err);
            return res.status(500).send('Error logging out');
        }
        // Clear the session cookie
        res.clearCookie('connect.sid');  // Name of the session cookie
        // Redirect to login page without any query parameters
        res.redirect('/user/login');
    });
};

// Assignment submission route
exports.submitAssignment = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login');  // Ensure the user is logged in
    }
    try {
        const { task, adminId } = req.body;
        const newAssignment = new Assignment({
            userId: req.session.user.id,  // Use the logged-in user's ID
            task,
            adminId,
            status: 'pending'  // Default status
        });
        await newAssignment.save();
        res.redirect('/user/dashboard'); // Redirect to the dashboard after submission
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).send('Error submitting assignment');
    }
};
