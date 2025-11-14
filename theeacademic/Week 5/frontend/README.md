# PulseTrack Frontend

Frontend application for PulseTrack - A comprehensive health monitoring application built with React and Vite.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling

## Features

- 👥 **User Management** - Create, view, and delete user profiles
- 🏃 **Activity Tracking** - Log fitness activities with details
- 📅 **Appointment Scheduling** - Schedule and manage medical appointments
- 🎨 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Fast Development** - Hot Module Replacement (HMR) with Vite
- 🔄 **Real-time Updates** - Automatic data refresh after operations
- 💫 **Error Handling** - Comprehensive error and success messages
- 🌓 **Dark/Light Mode** - Automatic theme based on system preferences

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## Installation

### Setup Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd pulsetrack-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint (if different from default):
   - Open `src/services/api.js`
   - Update `API_BASE_URL` if your backend runs on a different URL

4. Run the development server:
```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Project Structure

```
pulsetrack-frontend/
├── public/                  # Static assets
├── src/
│   ├── pages/
│   │   ├── Home.jsx        # Landing page
│   │   ├── Users.jsx       # User management
│   │   ├── Activities.jsx  # Activity tracking
│   │   └── Appointments.jsx # Appointment scheduling
│   ├── services/
│   │   └── api.js          # API client and endpoints
│   ├── App.jsx             # Main app component with routing
│   ├── App.css             # App-specific styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── README.md               # Documentation
```

## Application Pages

### Home (`/`)
- Welcome page with feature overview
- Navigation to main sections

### Users (`/users`)
- Create new user profiles
- View all users with their health information
- Delete user profiles
- Fields: name, email, age, weight, height, gender

### Activities (`/activities`)
- Log new fitness activities
- View all activities with details
- Delete activity records
- Types: running, walking, cycling, swimming, gym, yoga, other
- Tracks: duration, calories burned, distance, notes

### Appointments (`/appointments`)
- Schedule new medical appointments
- View all appointments with status
- Update appointment status (complete, cancel)
- Delete appointments
- Statuses: scheduled, completed, cancelled, rescheduled

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### API Endpoints Used

**Users:**
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user

**Activities:**
- `GET /api/activities` - Fetch all activities
- `POST /api/activities` - Create new activity
- `DELETE /api/activities/:id` - Delete activity

**Appointments:**
- `GET /api/appointments` - Fetch all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## Features in Detail

### User Management
- Create users with comprehensive health information
- Validate email format
- Support for age, weight, height tracking
- Gender options: male, female, other

### Activity Tracking
- Multiple activity types supported
- Track duration in minutes
- Optional: calories burned and distance covered
- Add custom notes for each activity
- Associate activities with specific users

### Appointment Scheduling
- Link appointments to users
- Specify doctor information
- Set date and time for appointments
- Add reason for visit
- Track appointment status
- Update status as appointments progress

## Styling

The application features:
- Modern, clean interface
- Responsive grid layouts
- Card-based design
- Intuitive forms with validation
- Color-coded status indicators
- Dark/light mode support based on system preferences

## Error Handling

- Network error handling with user-friendly messages
- Form validation
- Loading states during API calls
- Success notifications for completed actions
- Confirmation dialogs for destructive actions

## Development Tips

1. **Hot Module Replacement**: Changes to code automatically reflect in the browser without full reload

2. **API Proxy**: Vite is configured to proxy `/api` requests to `http://localhost:5000` to avoid CORS issues during development

3. **Component State**: Each page manages its own state for forms and data

4. **Error Messages**: All API calls are wrapped in try-catch blocks with user-friendly error messages

## Building for Production

```bash
# Create production build
npm run build

# The build output will be in the `dist` folder
# Preview the production build locally
npm run preview
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Backend Connection Issues
- Ensure backend server is running on port 5000
- Check `src/services/api.js` for correct API URL
- Verify CORS is enabled on the backend

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Development Server Issues
- Change port in `vite.config.js` if 3000 is occupied
- Check console for error messages

## License

MIT License

## Author

@theeacademic

## Support

For issues or questions, please open an issue in the repository.
