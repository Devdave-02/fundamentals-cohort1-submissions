# PulseTrack - Frontend

This repository contains the React + Vite frontend for PulseTrack, a comprehensive health monitoring application. It provides a clean, reactive, and user-friendly interface to interact with the pulsetrack-backend API.

The UI allows users to manage all aspects of their health data, including logging fitness, tracking meals, booking appointments, and, most importantly, viewing integrated health reports.

## Features

* Modern Stack: Built with React and Vite for a fast, modern development experience.

* Tabbed Interface: A clean, tabbed layout to separate concerns (Dashboard, Appointments, Doctors, Reports).

* Reactive Forms: Simple and effective forms for creating all data types (Users, Activities, Meals, etc.).

* Dynamic Lists: All data lists (e.g., Activity Log) update automatically upon new submissions.

* Centralized API: All axios API calls are centralized in src/api/apiService.js for easy management.

* Comprehensive Report Modal: A dynamic modal that fetches and displays the fully populated, integrated health report, fulfilling the core challenge requirement.

* Loading/Error States: Basic loading and error handling on forms.

## Project Structure
```
pulsetrack-frontend/
├── src/
│   ├── api/
│   │   └── apiService.js   # Centralized Axios API functions
│   ├── components/
│   │   ├── UserSelector.jsx      # Select the active user
│   │   ├── ActivityForm.jsx
│   │   ├── ActivityList.jsx
│   │   ├── MealForm.jsx
│   │   ├── MealList.jsx
│   │   ├── DoctorForm.jsx
│   │   ├── DoctorList.jsx
│   │   ├── AppointmentForm.jsx
│   │   ├── AppointmentList.jsx
│   │   ├── ReportGenerator.jsx
│   │   ├── ReportList.jsx
│   │   └── ReportModal.jsx     # Detail view for integrated report
│   ├── App.css               # Main application styles
│   ├── ReportModal.css       # Styles specific to the report modal
│   ├── App.jsx               # Main layout, state, and tab manager
│   └── main.jsx
└── package.json
```

## Setup and Installation

Prerequisite: Ensure the pulsetrack-backend server is running (by default on http://localhost:5001).

## Clone the repository:
```
git clone https://github.com/martins0023/pulsetrack-frontend.git
cd pulsetrack-frontend
```

## Install dependencies:
```
npm install
```

## Run the development server:
```
npm run dev
```

The application will be available at http://localhost:5173 (or the next available port).

## Implementation & Integration Strategy

This frontend was designed to solve the challenge of integrating multiple complex entities into a "single ecosystem."

1. Core Architecture
    - `App.jsx` as Controller: The main App.jsx component manages the highest-level state, including the selectedUserId and the activeTab. It passes this state down to all child components.

    - `apiService.js` as Data Layer: A dedicated API module (src/api/apiService.js) abstracts all axios logic. This keeps components clean and makes the API easy to update.

    - "Form-and-List" Pattern: Most tabs use a two-column layout displaying a "Form" component (e.g., `ActivityForm`) and a "List" component (e.g., ActivityList).

2. State Management & Data Refresh

    - State is managed locally within components using useState.

    - To solve the problem of refreshing a list component when a form component (a sibling) successfully submits, a simple "refresh key" pattern is used.

        - App.jsx holds a refreshKey in state.

        - Form components call a handleRefresh() function passed down as a prop (onNewActivity, onNewMeal, etc.).

        - This function increments the refreshKey.

        -List components have refreshKey in their useEffect dependency array.

        - When the key changes, useEffect re-runs, and the list re-fetches its data from the API.

3. Fulfilling the "Comprehensive Integration"

    The "Reports" tab is the culmination of the entire application and solves the integration challenge.

    - Generate: The ReportGenerator.jsx component provides a form to post to the POST /api/reports endpoint with a userId and date range.

    - List: The ReportList.jsx component displays all generated reports for the selected user.

    - Integrate & View: This is the key.

        - clicking "View Details" on a report item calls the handleViewReport function in App.jsx.

        - This function calls apiService.getReportById(reportId), which hits the backend's GET /api/reports/:id endpoint.

        - The backend responds with a single, fully populated JSON object containing the report's summary and all associated Activity, Meal, and Appointment documents.

        - This comprehensive object is set in state and passed to the ReportModal.jsx component.

        - The modal then renders this integrated data, presenting a true "single ecosystem" view of the user's health for that period.

## Application UI Screenshots

Main Dashboard (Activities & Meals):
- ![alt text](<Screenshot 2025-10-24 182925.png>)

Appointments & Doctors Tab:
- ![alt text](<Screenshot 2025-10-24 185856.png>)

Report Generation & List:
- ![alt text](<Screenshot 2025-10-24 190010.png>)

The Integrated Report Modal (Core Feature):
- ![alt text](<Screenshot 2025-10-24 190040.png>)