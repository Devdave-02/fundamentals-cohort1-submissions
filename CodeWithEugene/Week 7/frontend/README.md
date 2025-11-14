# CodePilot Frontend

A minimal React-Vite frontend application to interact with the CodePilot Backend API.

## Features

- User authentication (Register/Login)
- Product browsing
- Order creation and management
- Error handling and loading states
- Responsive design

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Configuration

The frontend is configured to proxy API requests to `http://localhost:3000` (backend server).

Make sure the backend server is running before using the frontend.

## Usage

1. Start the backend server (from the backend directory):
   ```bash
   npm run dev
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

4. Register a new account or login with existing credentials

5. Browse products and create orders

## Features

- **Authentication**: Register and login functionality
- **Products**: View all available products with stock information
- **Orders**: View your order history
- **Error Handling**: Displays error messages for failed API calls
- **Loading States**: Shows loading indicators during API requests
- **Responsive**: Works on desktop and mobile devices
