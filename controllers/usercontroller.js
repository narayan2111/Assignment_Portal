const express = require('express');
const User = require('../models/users.js');
const Admin = require('../models/adminModel.js');
const Assignment = require('../models/assignmentModel.js');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');  // Assuming you have a login.ejs file to render
});

// Route to render the user form
router.get('/form', (req, res) => {
    res.render('userForm');  // Render the 'userForm.ejs' template
});

// Route to handle user submissions
router.post('/submit', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Create a new user object
        const newUser = new User({
            name,
            email,
            password,
            role: 'user'  // Default role
        });

        // Save the user in the database
        await newUser.save();

        // Set a success message and redirect to the login page
        res.render('login', { successMessage: 'Account created successfully! Please log in.' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).send('Invalid email or password');
        }

        res.redirect(`/user/dashboard?userId=${user._id}`);
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/dashboard', async (req, res) => {
    const userId = req.query.userId;

    try {
        const user = await User.findById(userId);
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
});


// Route to handle assignment submission
router.post('/assignment/submit', async (req, res) => {
    console.log('Assignment submission route hit'); // Log for debugging

    try {
        const { userId, task, adminId } = req.body;
        

        const newAssignment = new Assignment({
            userId,
            task,
            adminId,
            status: 'pending'  // Default status
        });

        await newAssignment.save();
        res.redirect('/users/dashboard');
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).send('Error submitting assignment');
    }
});




module.exports = router;
