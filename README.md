
---

# Assignment Submission Portal

This project is a backend application designed to manage an assignment submission portal. Users can register, submit assignments, and view their submission status through a web-based interface.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Features

- User authentication (signup, login, logout).
- Secure session management using `connect-mongo` and `express-session`.
- Submit and track assignment statuses.
- Admin and user roles.
- Validation for user input to prevent erroneous data.
  
## Technologies Used

- **Node.js**: Backend runtime.
- **Express.js**: Framework for API routes and middleware.
- **MongoDB**: NoSQL database for user and assignment storage.
- **Mongoose**: ODM for MongoDB.
- **EJS**: Templating engine for server-side views.
- **Body-Parser**: Middleware for parsing request bodies.
- **Express-Session**: Session management middleware.
- **connect-mongo**: Session store using MongoDB.
- **dotenv**: For environment variable management.

## Deployment Link
You can access the live version here:  
[https://assignment-portal.onrender.com](https://assignment-portal.onrender.com)

## Installation

Follow these steps to run the application on your local machine.

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-repo/assignment-portal.git
   cd assignment-portal
   ```

2. **Install Dependencies:**

   Make sure you have Node.js and npm installed. Run the following command to install the necessary packages:

   ```bash
   npm install
   ```

3. **Environment Variables:**

   Create a `.env` file in the root directory and set the following variables:

   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/assignment_portal_db
   PORT=8080
   NODE_ENV=development
   ```

4. **Run the Application Locally:**

   Start the application using Node.js:

   ```bash
   node index.js
   ```

   Alternatively, for development, you can use `nodemon` (if installed):

   ```bash
   npx nodemon index.js
   ```

   The application will run at `http://localhost:8080`.

## Usage

1. **Access the Login Page**:  
   Go to `http://localhost:8080/login` to access the login page.

2. **Register a User**:  
   You can register a new user by visiting the signup form at `/user/form`.

3. **Submit Assignments**:  
   Once logged in, users can submit assignments from the dashboard.

## API Endpoints

- **GET `/user/login`**: Render login page.
- **POST `/user/login`**: Handle login form submission.
- **GET `/user/form`**: Render signup form.
- **POST `/user/submit`**: Submit new user signup.
- **GET `/user/dashboard`**: Display the user dashboard with submitted assignments.
- **POST `/user/assignment/submit`**: Submit a new assignment.
- **GET `/user/logout`**: Logout user and destroy session.
