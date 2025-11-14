# PulseTrack Backend

Backend API for PulseTrack - A comprehensive health monitoring application that integrates user fitness data, meal tracking, and medical appointments.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## Features

- User management (CRUD operations)
- Activity tracking (fitness activities with duration, calories, distance)
- Appointment scheduling with doctors
- Meal tracking with calorie information
- Medical reports management
- RESTful API design
- Data validation and error handling

## Database Schema

### Entities and Relationships

1. **User** (One-to-Many with Activities, Meals, Appointments, Reports)
   - Basic user information (name, email, age, weight, height, gender)

2. **Activity** (Many-to-One with User)
   - Fitness activity tracking
   - Types: running, walking, cycling, swimming, gym, yoga, other

3. **Meal** (Many-to-One with User)
   - Meal tracking with food items
   - Types: breakfast, lunch, dinner, snack

4. **Doctor**
   - Doctor information and availability
   - Specializations and contact details

5. **Appointment** (Many-to-One with User and Doctor)
   - Medical appointment scheduling
   - Status tracking: scheduled, completed, cancelled, rescheduled

6. **Report** (Many-to-One with User, One-to-One with Appointment)
   - Medical reports and lab results
   - Types: lab_test, diagnosis, prescription, scan, other

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd pulsetrack-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pulsetrack
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the application:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Activities

- `GET /api/activities` - Get all activities (optional: ?userId=<id>)
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/stats/:userId` - Get user activity statistics

### Appointments

- `GET /api/appointments` - Get all appointments (optional: ?userId=<id>&doctorId=<id>&status=<status>)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/upcoming/:userId` - Get upcoming appointments for a user

## API Request Examples

### Create User
```json
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "weight": 75,
  "height": 175,
  "gender": "male"
}
```

### Create Activity
```json
POST /api/activities
{
  "userId": "65abc123def456789",
  "activityType": "running",
  "duration": 30,
  "caloriesBurned": 300,
  "distance": 5,
  "notes": "Morning jog"
}
```

### Create Appointment
```json
POST /api/appointments
{
  "userId": "65abc123def456789",
  "doctorId": "65def456ghi789012",
  "appointmentDate": "2025-11-15",
  "appointmentTime": "10:00 AM",
  "reason": "Regular checkup",
  "notes": "Bring previous reports"
}
```

## Postman Documentation

Import the Postman collection to test all API endpoints:

1. Open Postman
2. Click Import
3. Upload the `postman_collection.json` file from this repository
4. Set the base URL to `http://localhost:5000`

## Project Structure

```
pulsetrack-backend/
├── config/
│   └── database.js          # Database connection
├── models/
│   ├── User.js              # User model
│   ├── Activity.js          # Activity model
│   ├── Meal.js              # Meal model
│   ├── Doctor.js            # Doctor model
│   ├── Appointment.js       # Appointment model
│   └── Report.js            # Report model
├── controllers/
│   ├── userController.js    # User logic
│   ├── activityController.js # Activity logic
│   └── appointmentController.js # Appointment logic
├── routes/
│   ├── userRoutes.js        # User routes
│   ├── activityRoutes.js    # Activity routes
│   └── appointmentRoutes.js # Appointment routes
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Entry point
└── README.md               # Documentation
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Author

@theeacademic

## Support

For issues or questions, please open an issue in the repository.
