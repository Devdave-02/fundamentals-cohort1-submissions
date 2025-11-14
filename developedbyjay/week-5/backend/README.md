# PulseTrack API

A comprehensive health tracking API built with Node.js, Express, TypeScript, and MongoDB. PulseTrack helps users manage their health data including activities, appointments, meals, and medical reports.

## Features

- **User Authentication & Authorization** - Secure JWT-based authentication with role-based access control
- **Activity Tracking** - Record and manage physical activities with calorie tracking
- **Appointment Management** - Schedule and manage medical appointments with doctors
- **Doctor Directory** - Browse and select healthcare providers by specialty
- **User Profiles** - Comprehensive user profile management
- **Health Reports** - Track and manage medical reports and health data
- **RESTful API** - Clean, well-structured REST endpoints
- **Type Safety** - Full TypeScript implementation for better development experience
- **Security** - Built-in security features with Helmet, CORS, and input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcrypt
- **Validation**: express-validator
- **Package Manager**: pnpm

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- pnpm (v10.11.1 or higher)
- MongoDB (local or cloud instance)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pulsetrack-api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/pulsetrack
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=1hr
   JWT_COOKIE_EXPIRES_IN=1hr
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:8080`

## API Documentation

### Interactive Documentation

For detailed API documentation with examples and testing capabilities, visit our Postman collection:

**[View API Documentation](https://documenter.getpostman.com/view/27459994/2sB3Wjz3k4)**

The Postman collection includes:

- Complete endpoint documentation
- Request/response examples
- Authentication flows
- Error handling examples
- Environment variables setup

### API Endpoints Overview

#### Authentication (`/v1/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout

#### User Management (`/v1/user`)

- `GET /profile` - Get user profile
- `PUT /update-profile` - Update user profile

#### Activities (`/v1/activity`)

- `GET /` - Get all user activities
- `POST /` - Create new activity
- `PUT /:id` - Update activity
- `DELETE /:id` - Delete activity

#### Appointments (`/v1/appointment`)

- `GET /` - Get all user appointments
- `POST /` - Create new appointment
- `PUT /:id` - Update appointment
- `DELETE /:id` - Delete appointment

#### Doctors (`/v1/doctor`)

- `GET /` - Get all doctors
- `POST /` - Create new doctor (admin only)

## Project Structure

```
src/
├── @types/           # TypeScript type definitions
├── controllers/      # Route controllers
│   └── v1/
│       ├── auth/     # Authentication controllers
│       ├── user/     # User management controllers
│       ├── activity/ # Activity tracking controllers
│       ├── appointment/ # Appointment controllers
│       └── doctor/   # Doctor management controllers
├── lib/              # Core utilities and configurations
│   ├── appError.ts   # Custom error handling
│   ├── cors.ts       # CORS configuration
│   ├── jwt.ts        # JWT utilities
│   └── mongoose.ts   # Database connection
├── middlewares/      # Express middlewares
│   ├── authentication.ts # JWT authentication
│   ├── authorization.ts  # Role-based authorization
│   └── validate.ts       # Input validation
├── models/           # Mongoose data models
│   ├── user.ts       # User model
│   ├── activity.ts   # Activity model
│   ├── appointment.ts # Appointment model
│   ├── doctor.ts     # Doctor model
│   ├── meal.ts       # Meal model
│   └── report.ts     # Report model
├── routes/           # API route definitions
│   └── v1/           # API version 1 routes
├── utils/            # Utility functions and types
└── index.ts          # Application entry point
```

## Authentication

The API uses JWT-based authentication. Include the access token in the Authorization header:

```bash
Authorization: Bearer <your-access-token>
```

### User Roles

- **user**: Standard user with access to personal data
- **admin**: Administrative access to all resources

## Data Models

### User

- Personal information (name, email, password)
- Role-based access control
- References to activities, meals, appointments, and reports

### Activity

- Activity type and duration
- Calorie tracking
- User association

### Appointment

- Doctor and user references
- Date and reason
- Associated reports

### Doctor

- Professional information
- Specialty and contact details
- Appointment references

## Error Handling

The API uses a centralized error handling system with:

- Custom error classes
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for development

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **bcrypt**: Password hashing
- **JWT**: Secure token-based authentication
- **Input Validation**: Request validation using express-validator
- **Rate Limiting**: Built-in protection against abuse


**Built for better health tracking**
