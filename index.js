const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');  // Import session middleware
const userRoutes = require('./routes/userRoutes'); // Ensure the path is correct
const adminRoutes = require('./routes/adminRoutes'); // Ensure the path is correct
require('dotenv').config();

const app = express();

// Serve static files
app.use(express.static('public'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure express-session
app.use(session({
    secret: 'sdah213ttasjbdajdajdalkzmxkzdla',  
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  
}));

// Set the view engine to EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Database connection
main().then(() => {
    console.log("Connection successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://assignment_portal_db:2ZL4H4uYW4gK0tkM@projects.wkaqy.mongodb.net/?retryWrites=true&w=majority&appName=Projects');
}

// Middleware to check if the user is already logged in (for login route)
function checkLogin(req, res, next) {
    if (req.session.user) {
        return res.redirect(`/user/dashboard`);
    }
    next();
}

// Use user and admin routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// If a logged-in user tries to visit /login, redirect to the dashboard
app.get("/login", checkLogin, (req, res) => {
    res.render('login');
});

// Listen to the defined port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
