# DevConnect-frontend
 # DevConnect - Frontend (React + Vite)

 Minimal frontend scaffold for DevConnect built with React and Vite. This app talks to the backend API under `/api` for authentication and project data.

 Tech stack
 - React + Vite
 - React Router
 - Axios for HTTP requests

 Repository contents
 - `index.html` - app entry
 - `src/main.jsx` - app bootstrap and route configuration
 - `src/pages/` - minimal pages (Home, Login, Signup, Project details)

 Quick start (local)
 1. Install dependencies:

 ```bash
 npm install
 ```

 2. Start dev server:

 ```bash
 npm run dev
 ```

 Notes about the API
 - During development the frontend expects the backend API to be reachable at `/api/*`.
 - Recommended: add a dev proxy in `vite.config.js` that forwards `/api` to your backend server (e.g., `http://localhost:4000`). Example proxy config can be added if you want.

 Environment and production
 - For production builds, set the API_BASE_URL in your app or use absolute URLs to the deployed backend.

 Features included
 - Signup / Login (stores token in localStorage)
 - Project listing and project details pages
 - Minimal navigation

 Deployment
 - You can deploy to Vercel or Netlify. Both support Vite builds.
 - Ensure the frontend is configured to call the deployed backend, not `/api` on the frontend host (unless you configure a proxy or rewrites).

 Next steps (suggested)
 - Add Vite proxy configuration (`vite.config.js`) for local dev
 - Add create project form and comment form on project page
 - Improve UI (TailwindCSS or a component library)
 - Add connection to deployed backend and update README with the live URLs
