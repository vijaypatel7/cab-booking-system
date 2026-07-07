# 🚕 RideNow --- Cab Booking App

A full-stack cab booking application built with **React (Vite)**,
**Node.js + Express**, **MongoDB Atlas**, **Docker**, and **Docker
Compose**.

## Features

-   JWT Authentication
-   User/Admin roles
-   Cab booking workflow
-   Ride history
-   Admin dashboard
-   Responsive React UI
-   REST APIs with Express
-   MongoDB Atlas integration
-   Dockerized frontend (Nginx) and backend
-   Docker Compose support
-   Ready for GitHub Actions CI/CD

## Architecture

``` text
Browser
   │
   ▼
Nginx (Frontend Container)
   │
   ├── React Static Files
   └── /api
         │
         ▼
Express API (Backend Container)
         │
         ▼
MongoDB Atlas
```

## Tech Stack

### Frontend

-   React
-   Vite
-   Axios
-   React Router
-   Framer Motion

### Backend

-   Node.js
-   Express
-   MongoDB
-   Mongoose
-   JWT

### DevOps

-   Docker
-   Docker Compose
-   Nginx
-   GitHub Actions (CI/CD ready)

## Project Structure

``` text
cab-booking/
├── .github/
│   └── workflows/
├── client/
├── server/
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
├── README.md
└── .gitignore
```

## Local Development

### Backend

``` bash
cd server
npm install
npm run dev
```

### Frontend

``` bash
cd client
npm install
npm run dev
```

Vite proxies `/api` requests to the backend.

## Docker

Build and start everything:

``` bash
docker compose up 
```

Stop:

``` bash
docker compose down
```

Application:

-   Frontend: http://localhost:5173
-   Backend: http://localhost:5005

## Docker Compose

The compose setup includes:

-   Frontend container
-   Backend container
-   Bridge network
-   Environment variable substitution
-   Restart policies

## Environment Variables

Create a root `.env` from `.env.example` and change all the values with actual values

## License

MIT
