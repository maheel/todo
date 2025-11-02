# TODO App

This project now uses a monorepo structure:

- **Frontend (React):** in the root directory, start with `npm start`
- **Backend API (Node/Express):** in `src/backend/server.js`, start with `npm run start:api`
- **Start both:** `npm run start:all`

## Start MongoDB locally with Docker

### `docker-compose up -d`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the React app in development mode.

### `npm run start:api`

Runs the backend API (Node/Express) from `src/backend/server.js`.

### `npm run start:all`

Runs both the frontend and backend concurrently.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**


Add thest to the host file

nano /etc/hosts

127.0.0.1 mongo1
127.0.0.1 mongo2
127.0.0.1 mongo3
