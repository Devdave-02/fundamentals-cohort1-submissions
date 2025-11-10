#  CodePilot Frontend

A modern frontend application built with **React**, **TypeScript**, **Vite**, and **TailwindCSS**.  
This project serves as the frontend for the CodePilot web app — providing a clean, responsive, and fast user experience.


##  Tech Stack

| Technology | Description |
|-------------|-------------|
| **React** | UI Library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Next-gen frontend tooling |
| **TailwindCSS** | Utility-first CSS framework |
| **React Router DOM** | Client-side routing |
| **ESLint + Prettier** | Code linting and formatting |

---

##  Installation

Clone the repository and install dependencies:

```bash
# Clone repo
git clone https://github.com/nuelose/codepilot-frontend.git
```

## Navigate into folder
```bash
cd codepilot-frontend
```

## Install dependencies
```bash
npm install
```

## Development
```bash
npm run dev
```

---

## Important Note (CORS)

Please ensure you run the frontend on the default **Vite port: [http://localhost:5173](http://localhost:5173)**.  
The backend API is configured to accept requests **only from this origin**.

If you change the port or host, you may encounter CORS errors when making API requests.

To make sure it runs on port 5173:



