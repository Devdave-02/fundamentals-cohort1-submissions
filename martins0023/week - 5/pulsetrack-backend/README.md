# PulseTrack - Backend

This repository contains the Node.js, Express, and MongoDB backend for PulseTrack, a comprehensive health monitoring application. It is designed to handle complex relationships between users, fitness data, meals, doctors, and appointments, integrating them into a single ecosystem.

This backend provides a robust RESTful API for all data operations, including the generation of comprehensive health reports.

## Features

    * RESTful API: A complete API built with Express.js.

    * Database: Uses MongoDB with Mongoose for robust data modeling and schema enforcement.

    * Complex Relationships: Manages one-to-many (User -> Activity) and many-to-many (User <-> Doctor via Appointment) relationships.

    * Data Integration: A dedicated endpoint to generate comprehensive Report documents that aggregate and snapshot all other user data.

    *Environment Ready: Uses dotenv for secure management of environment variables.

    * CORS Enabled: Pre-configured cors middleware to allow requests from the frontend.

# Project Structure

```
    pulsetrack-backend/
    ├── config/
    │   └── db.js         # MongoDB connection logic
    ├── controllers/
    │   ├── userController.js
    │   ├── activityController.js
    │   ├── mealController.js
    │   ├── doctorController.js
    │   ├── appointmentController.js
    │   └── reportController.js
    ├── models/
    │   ├── User.js
    │   ├── Activity.js
    │   ├── Meal.js
    │   ├── Doctor.js
    │   ├── Appointment.js
    │   └── Report.js
    ├── routes/
    │   └── api.js        # Main API router
    ├── .env.example    # Example environment file
    ├── .gitignore
    ├── package.json
    └── server.js       # Express server entry point
```


## Setup and Installation

# Clone the repository:
```
git clone https://github.com/martins0023/pulsetrack-backend.git
cd pulsetrack-backend
```


# Install dependencies:
```
npm install
```


# Create Environment File:
Create a .env file in the root directory. Copy the contents of .env.example into it and add your MongoDB connection string.
```
PORT=5001
MONGO_URI=your_mongodb_connection_string_here
```


# Run the server:
For development (with hot-reloading):
```
npm run dev
```

# For production:
```
npm start
```

The server will be running on http://localhost:5001.

# Database Schema Design

The database schema was designed to be robust, scalable, and relational, fulfilling the core of the challenge.

* User Model:

    - Purpose: The central entity of the entire ecosystem. All primary data points (activities, meals, appointments) are anchored to a User.

    - Fields: username, email.

    - Relationships: Has a one-to-many relationship with Activity, Meal, Appointment, and Report.

* Doctor Model:

    - Purpose: An independent, reusable entity. This is superior to embedding doctor names in appointments, as it prevents data duplication and allows for a "Doctors" management page.

    - Fields: name, specialty, clinicAddress.

    - Relationships: Has a one-to-many relationship with Appointment.

* Activity & Meal Models:

    - Purpose: These models directly satisfy the "user fitness data" and "meal tracking" requirements.

    -Fields:

    - Activity: type, duration, caloriesBurned, date.

    - Meal: name (e.g., Breakfast), foodItems (a sub-document array), totalCalories (auto-calculated with a pre-save hook).

    - Relationships: Both models contain a required user field (a Schema.Types.ObjectId ref), creating a classic one-to-many relationship with User.

* Appointment Model:

    - Purpose: This is the key "join" model that facilitates the complex relationship between User and Doctor.

    - Fields: date, reason.

    - Relationships: Contains both a user ref and a doctor ref. This efficiently models a many-to-many relationship (a user can have many doctors, a doctor can have many users).

* Report Model (The Integration Core):

    - Purpose: This model is the "single ecosystem" integration. It's not just a document; it's a snapshot of a user's health over a defined period.

    - Fields: title, startDate, endDate, summary (a sub-document with aggregated data like averageDailyCalories), and arrays of Schema.Types.ObjectId refs for activities, meals, and appointments.

    - Implementation: The POST /api/reports endpoint performs all the business logic. It finds all relevant data within the date range, performs calculations (e.g., reduce, average), and saves this aggregated summary and the references into a new Report document.

# Postman API Documentation

A complete Postman collection is included in this repository. You can import PulseTrack.postman_collection.json or use the public link below.

![alt text](<Screenshot 2025-10-24 191309.png>)




* Below are examples of the Postman collection structure and key requests.

Collection Structure:

- Example: Creating a New User (POST /api/users):

- Example: Getting Appointments (GET /api/appointments/user/...):

API Endpoint Quick Reference

# User
```
POST

/api/users

Creates a new user.
```

```
GET

/api/users

Gets all users.
```

```
GET

/api/users/:id

Gets a single user by ID.
```

# Doctor
```
POST

/api/doctors

Adds a new doctor.
```

```
GET

/api/doctors

Gets all doctors.
```

# Activity
```
POST

/api/activities

Logs a new activity for a user.
```

```
GET

/api/activities/user/:userId

Gets all activities for a user.
```

# Meal
```
POST

/api/meals

Logs a new meal for a user.
```

```
GET

/api/meals/user/:userId

Gets all meals for a user.
```

# Appoint.
```
POST

/api/appointments

Books an appointment for a user with a doctor.
```

```
GET

/api/appointments/user/:userId

Gets all appointments for a user (with doctor details).
```

# Report
```
POST

/api/reports

Generates a new comprehensive report for a user.
```

```
GET

/api/reports/user/:userId

Gets all reports for a user.
```

```
GET

/api/reports/:id

Gets a single, fully populated report by its ID.
```