# Flowserve Frontend

A modern React application built with TypeScript, Vite, and TanStack Query for managing transactions and user authentication.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Architecture](#architecture)
- [Contributing](#contributing)

## Features

- User authentication (Sign In/Sign Up)
- Transaction management with data tables
- Protected routes with authentication guards
- Form validation with React Hook Form and Zod
- State management with Zustand
- Server state management with TanStack Query
- Responsive UI with Tailwind CSS
- Reusable component library with Radix UI
- Type-safe development with TypeScript

## Tech Stack

### Core

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server

### Routing & State

- **React Router DOM** - Client-side routing
- **Zustand** - Global state management
- **TanStack Query** - Server state management
- **Immer** - Immutable state updates

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **next-themes** - Theme management

### Forms & Validation

- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form resolver integration

### Data Management

- **TanStack Table** - Headless table utilities

### Developer Tools

- **ESLint** - Code linting
- **React Compiler** - Optimization
- **vite-tsconfig-paths** - Path resolution

## Project Structure

```
flowserve-frontend/
├── src/
│   ├── components/
│   │   ├── layout/              # Layout components
│   │   │   ├── dashboard-layout.tsx
│   │   │   └── protected-route.tsx
│   │   └── ui/                  # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── table.tsx
│   │       └── controlled/      # Controlled form components
│   ├── lib/                     # Utility functions and helpers
│   │   ├── create-store.ts
│   │   ├── execute-action.ts
│   │   ├── request.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── pages/                   # Feature-based page modules
│   │   ├── sign-in/
│   │   │   ├── _component/
│   │   │   ├── _libs/
│   │   │   ├── _services/
│   │   │   └── _types/
│   │   ├── sign-up/
│   │   │   ├── _components/
│   │   │   ├── _services/
│   │   │   └── _types/
│   │   └── transaction/
│   │       ├── _components/
│   │       ├── _lib/
│   │       ├── _schema/
│   │       └── _service/
│   ├── App.tsx                  # Root component with routes
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── components.json              # shadcn/ui configuration
├── eslint.config.js             # ESLint configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── package.json                 # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (package manager)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/developedbyjay/flowserve-frontend.git
cd flowserve-frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your environment variables.

4. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

## Development

### Code Organization

The project follows a feature-based architecture where each feature module contains:

- `_components/` - React components specific to the feature
- `_services/` or `_service/` - API calls and data fetching logic
- `_libs/` or `_lib/` - Feature-specific utilities and stores
- `_types/` or `_schema/` - TypeScript types and Zod schemas

### State Management

- **Zustand** - Used for global client state (user authentication, transaction state)
- **TanStack Query** - Used for server state management (data fetching, caching, mutations)

### Form Handling

Forms are built using React Hook Form with Zod schema validation. Controlled components are available in `src/components/ui/controlled/` for consistent form integration.

### Styling

The project uses Tailwind CSS with a custom configuration. Component styling follows the shadcn/ui pattern with customizable themes.

## Architecture

### Routing

The application uses React Router DOM with the following structure:

- Public routes: `/login`, `/register`
- Protected routes: `/dashboard/*`
- Default redirect: `/` redirects to `/dashboard`

### API Integration

API calls are handled through:

1. Custom request utility (`src/lib/request.ts`)
2. TanStack Query hooks for data fetching
3. Mutation hooks for data updates

### Component Patterns

- Controlled form inputs for consistent validation
- Compound components for complex UI elements
- Dialog and modal components for user interactions
- Protected route wrapper for authentication
