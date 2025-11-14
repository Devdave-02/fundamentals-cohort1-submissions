# CodePilot Frontend

> Minimal React-Vite client for testing CodePilot Backend API with comprehensive error handling and loading states

## 📋 Overview

This frontend application provides a user interface to interact with the CodePilot Backend API. It demonstrates proper error handling, loading states, and modern React best practices.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client

## ✨ Features

- ✅ User Management (CRUD operations)
- ✅ Transaction Management
- ✅ Real-time error handling
- ✅ Loading states for all async operations
- ✅ Responsive design
- ✅ API integration with comprehensive error feedback

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Clone the repository
cd codepilot-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will start on `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── services/         # API service layer
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## 🔧 Configuration

Update API base URL in `src/services/api.js` if backend runs on different port:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 🎨 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🌐 Features in Detail

### User Management
- View all users with pagination
- Create new users
- Update user information
- Delete users
- Real-time validation feedback

### Transaction Management
- View transaction history
- Create deposits and withdrawals
- Filter by user
- Transaction status tracking

### Error Handling
- Network error detection
- User-friendly error messages
- Retry mechanisms
- Graceful degradation

### Loading States
- Skeleton loaders
- Progress indicators
- Optimistic UI updates
- Request cancellation

## 📄 License

MIT License

## 👨‍💻 Author

@theeacademic

---

**For API documentation, see the backend README.md**
