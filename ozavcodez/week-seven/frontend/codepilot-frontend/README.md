# CodePilot Frontend

A React-Vite frontend application for testing and displaying API endpoints from the CodePilot backend with error handling and loading states.

## Features

- Health check endpoint testing
- User authentication (registration and login)
- Product listing with filtering capabilities
- Product creation (authenticated users only)
- Comprehensive error handling and loading states

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure the CodePilot backend is running on `http://localhost:3000`

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks for data fetching
├── services/       # API service functions
└── App.tsx         # Main application component
```

## API Endpoints Tested

- `GET /health` - Server health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product

## Error Handling

The application includes comprehensive error handling for:
- Network errors
- API error responses
- Validation errors
- Authentication errors

## Loading States

All API calls display appropriate loading states to provide feedback to the user during data fetching.