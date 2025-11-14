# Pulse Track

A modern healthcare appointment management system built with Next.js 16, featuring user authentication, appointment scheduling, and doctor management capabilities.

## Features

### Authentication System

- **User Registration & Login**: Secure authentication with email/password
- **Role-based Access**: Support for both user and admin roles
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Token-based authentication with automatic redirects

### Appointment Management

- **Create Appointments**: Schedule appointments with doctors
- **Edit Appointments**: Modify existing appointment details
- **Doctor Selection**: Choose from available doctors
- **Date & Time Scheduling**: Calendar-based appointment scheduling
- **Reason Documentation**: Track appointment purposes

### Dashboard Features

- **Appointment Overview**: View all scheduled appointments
- **Activity Tracking**: Monitor user activity (placeholder for future features) (In-progress)
- **Responsive Design**: Mobile-first approach with dark mode support

## Tech Stack

### Frontend

- **Next.js 16**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Modern component library with Radix UI primitives

### State Management & Data Fetching

- **TanStack Query**: Server state management and caching
- **Zustand**: Lightweight client state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation and type inference

### UI Components

- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **Sonner**: Toast notifications
- **React Day Picker**: Calendar component
- **Date-fns**: Date manipulation utilities

### Development Tools

- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **React Compiler**: Automatic optimization (experimental)

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/              # Login page and components
│   │   └── sign-up/              # Registration page and components
│   ├── (protected)/              # Protected dashboard routes
│   │   ├── dashboard/            # Main dashboard
│   │   │   ├── appointments/      # Appointment management
│   │   │   └── activity/          # Activity tracking
│   │   └── _components/           # Shared dashboard components
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                    # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   └── providers.tsx             # App providers
├── lib/                          # Utility functions and configurations
│   ├── auth.ts                   # Authentication utilities
│   ├── create-store.ts           # Zustand store factory
│   ├── request.ts                # API request utilities
│   └── utils.ts                  # General utilities
└── proxy.ts                      # Middleware for authentication
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pulse-track
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Add your environment variables here
   # API_URL=your-backend-url
   # DATABASE_URL=your-database-url
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Configuration

### Authentication

The app uses token-based authentication with middleware protection. Authentication tokens are stored in cookies and automatically included in API requests.

### API Integration

The application is designed to work with a backend API. Update the API endpoints in the service files to match your backend configuration.



## Architecture

### Authentication Flow

1. User signs in/up through auth pages
2. Access token stored in cookies
3. Middleware validates tokens on protected routes
4. API requests include authentication headers

### State Management

- **Server State**: Managed by TanStack Query for API data
- **Client State**: Managed by Zustand for UI state
- **Form State**: Managed by React Hook Form with Zod validation

### Component Organization

- **Feature-based**: Components organized by feature/route
- **Reusable UI**: Shared components in `/components/ui`
- **Type Safety**: Full TypeScript coverage with Zod schemas

## Security Features

- **Route Protection**: Middleware-based authentication
- **Input Validation**: Zod schema validation
- **Type Safety**: TypeScript for compile-time safety
- **Secure Headers**: Proper authentication token handling



## Development Notes

### Default Credentials

The sign-in form includes default credentials for development:

- Email: `aterejemima@gmail.com`
- Password: `Developed@1`

### Future Enhancements

- Activity tracking implementation
- Report management
- Advanced appointment features
- Admin dashboard
- Real-time notifications

## License

This project is private and proprietary.

Built with Next.js, TypeScript, and modern web technologies.
