const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require('body-parser');
const userRoutes = require('./controllers/usercontroller'); // Use correct path
const adminRoutes = require('./controllers/admincontroller'); // Use correct path

require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

main().then(() => {
    console.log("Connection successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://assignment_portal_db:2ZL4H4uYW4gK0tkM@projects.wkaqy.mongodb.net/?retryWrites=true&w=majority&appName=Projects');
}

app.use('/user', userRoutes); // Use user routes
app.use('/admin', adminRoutes); // Use admin routes

app.get("/",(req,res)=>{
    res.render('login.ejs');
})
app.get("/login", (req, res) => {
    res.render('login.ejs');
});

const PORT = process.env.PORT || 8080; // Use Render's PORT or default to 8080
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});