# E-commerce Frontend

A modern React-based frontend application for the E-commerce Cart Service. Built with React, Vite, and Tailwind CSS, this application provides a user-friendly interface for browsing products, managing cart, and user authentication.

## 🚀 Features

- **Product Catalog** - Browse products with pagination, filtering, and search
- **Shopping Cart** - Add, update, and remove items from cart
- **User Authentication** - Login and registration with JWT tokens
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Real-time Updates** - Cart updates in real-time
- **Modern UI/UX** - Clean and intuitive user interface

## 🛠️ Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Context API** - State management

## 📁 Project Structure

```
ecommerce-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation header
│   │   ├── ProductCard.jsx      # Product display card
│   │   └── CartItem.jsx         # Cart item component
│   ├── contexts/
│   │   ├── AuthContext.jsx      # Authentication state
│   │   └── CartContext.jsx      # Cart state management
│   ├── pages/
│   │   ├── Products.jsx         # Product listing page
│   │   ├── Login.jsx            # Login page
│   │   ├── Register.jsx         # Registration page
│   │   └── Cart.jsx             # Shopping cart page
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Global styles
├── package.json
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:3001`

### Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🎨 UI Components

### Header Component
- Navigation bar with logo
- User authentication status
- Cart icon with item count
- Responsive mobile menu

### ProductCard Component
- Product image, name, and description
- Price and stock information
- Add to cart functionality
- Category tags

### CartItem Component
- Item details and image
- Quantity controls
- Remove item functionality
- Price calculations

## 🔐 Authentication Flow

1. **Registration**
   - User fills out registration form
   - JWT token stored in localStorage
   - Automatic redirect to products page

2. **Login**
   - User enters credentials
   - JWT token stored in localStorage
   - User state updated in context

3. **Protected Routes**
   - Cart page requires authentication
   - Automatic redirect to login if not authenticated

## 🛒 Cart Functionality

- **Add to Cart** - Add products with quantity selection
- **Update Quantity** - Increase/decrease item quantities
- **Remove Items** - Remove individual items from cart
- **Clear Cart** - Remove all items at once
- **Real-time Updates** - Cart updates immediately
- **Persistent Cart** - Cart persists across browser sessions

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile** - Single column layout, touch-friendly buttons
- **Tablet** - Two-column product grid
- **Desktop** - Multi-column layout with sidebar

## 🎯 Key Features

### Product Browsing
- Paginated product listing
- Category filtering
- Search functionality
- Product details view

### Shopping Cart
- Add/remove items
- Quantity management
- Total calculations
- Cart persistence

### User Experience
- Loading states
- Error handling
- Success notifications
- Smooth transitions

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

### Tailwind Configuration
Customize the design system in `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add custom colors, fonts, etc.
    },
  },
  plugins: [],
}
```

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
```

## 🔒 Security Considerations

- JWT tokens stored in localStorage
- Automatic token refresh handling
- Protected route authentication
- Input validation and sanitization

## 📊 State Management

The application uses React Context API for state management:

### AuthContext
- User authentication state
- Login/logout functionality
- Token management

### CartContext
- Cart items and totals
- Cart operations (add, update, remove)
- Real-time cart updates

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Custom Components** - Reusable UI components
- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - Easy to implement dark theme

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Brave Redemptive** - *Initial work* - [GitHub](https://github.com/braveredemptive)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first approach
- Heroicons for the beautiful icons

---

**Note:** This frontend is designed to work with the E-commerce Cart Service backend. Make sure the backend is running on `http://localhost:3001` before starting the frontend development server.