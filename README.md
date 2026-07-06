# 🚕 RideNow — Cab Booking App

A full-stack cab booking application built with **React** (Vite) and **Node.js + Express** with **MongoDB**.

## 🏗️ Architecture

```
Frontend (React/Vite) → Axios → Vite Proxy → Express Route → Controller → Mongoose Model → MongoDB
```

## ✨ Features

- 🔐 **Authentication** — Register / Login / Logout with JWT + role-based access (user, driver, admin)
- 📍 **Book a Ride** — 3-step booking flow: Route → Ride Type → Confirm & Pay
- 💰 **Fare Calculation** — Base + per-km + per-minute for Economy, Comfort, Premium
- 🚗 **Driver Auto-Assignment** — Available drivers are matched on booking
- 📜 **Ride History** — Filter by status, cancel pending rides, rate completed rides
- 🖥️ **User Dashboard** — Stats, recent rides, quick actions
- 🛡️ **Admin Dashboard** — 5 tabs: Overview, Revenue, Rides, Locations, Users (with search, pagination, 3-dot menu)
- 🌙 **Dark Mode** — Full dark theme via ThemeContext + CSS variables + `.dark` class (persisted to localStorage)
- ⚡ **Optimistic UI** — Instant feedback for booking, cancellation, rating, avatar upload
- 📱 **Responsive Design** — Mobile hamburger menu, collapsible sidebar, adaptive grid layouts
- 🎨 **Animations** — Framer Motion throughout (page transitions, hover/tap, accordion, charts)
- 🍞 **Toast Notifications** — React Hot Toast with single-fire fix for StrictMode

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Framer Motion
- Lucide React (icons)
- React Hot Toast
- Axios (with interceptors for auth + 401 handling)
- Context API (AuthContext, ThemeContext)
- Custom Hooks (useAuth, useTheme, useAxios)

### Backend
- Node.js + Express
- MongoDB + Mongoose 7
- JWT Authentication (7-day expiry)
- Multer (avatar uploads)
- CORS + Cookie Parser + Morgan

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally or Atlas URI

### 1. Backend Setup
```bash
cd server
npm install
```

Create `.env` file (see below), then:
```bash
npm run dev
```

### 2. Seed Demo Data
```bash
node seed.js
```
This creates:
| Role   | Email               | Password  |
|--------|---------------------|-----------|
| Admin  | admin@ridenow.in    | admin123  |
| Driver | driver@ridenow.in   | driver123 |
| User   | user@ridenow.in     | user123   |

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The app runs at **http://localhost:5173** with API requests proxied to the backend on port 5000.

## 📁 Project Structure

```
cab-booking-app/
├── client/                          # React (Vite) Frontend
│   ├── src/
│   │   ├── api/                     # Axios instance + API modules
│   │   │   ├── axios.js             # Base config + interceptors
│   │   │   ├── authApi.js
│   │   │   ├── rideApi.js
│   │   │   ├── userApi.js
│   │   │   └── adminApi.js
│   │   ├── components/              # Shared components
│   │   │   ├── Navbar.jsx           # Desktop + mobile nav + profile dropdown
│   │   │   ├── Sidebar.jsx          # Desktop sidebar with MENU + SUPPORT sections
│   │   │   ├── Loader.jsx
│   │   │   ├── RideCard.jsx
│   │   │   └── ProtectedRoute.jsx   # Auth guard + role-based access
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Login/register/logout + user state
│   │   │   └── ThemeContext.jsx      # Dark mode toggle + persistence
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTheme.js
│   │   │   └── useAxios.js
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with hero + features
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx        # User stats + recent rides
│   │   │   ├── BookRide.jsx         # 3-step booking flow
│   │   │   ├── RideHistory.jsx      # Filter + cancel + rate
│   │   │   ├── Profile.jsx          # Edit name/phone + avatar upload
│   │   │   ├── Settings.jsx         # Toggles + dark mode
│   │   │   ├── Help.jsx             # FAQ accordion + contact cards
│   │   │   └── AdminDashboard.jsx   # 5-tab admin panel
│   │   ├── utils/
│   │   │   ├── calculateFare.js     # Fare calculation + formatCurrency
│   │   │   └── formatDate.js        # Date/time formatting
│   │   ├── App.jsx                  # Routes + providers
│   │   ├── main.jsx                 # Entry point (StrictMode)
│   │   └── index.css                # Global styles + dark mode variables
│   └── vite.config.js               # Dev proxy to backend
│
├── server/                          # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, login, getMe, updateProfile
│   │   ├── userController.js        # getUserStats, getUsers, deleteUser
│   │   ├── rideController.js        # bookRide, getRides, cancelRide, rateRide
│   │   └── adminController.js       # 9 admin endpoints
│   ├── models/
│   │   ├── User.js                  # name, email, password, role, isActive, avatar
│   │   ├── Ride.js                  # pickup, dropoff, fare, status, rating
│   │   └── Driver.js                # license, vehicle, location, isAvailable
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── rideRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # protect + authorize(role)
│   │   ├── errorMiddleware.js       # AppError + global handler + 404
│   │   └── uploadMiddleware.js      # Multer config for avatar uploads
│   ├── utils/
│   │   ├── generateToken.js         # JWT signing
│   │   └── sendResponse.js          # Standardized API response
│   ├── uploads/                     # Avatar upload directory
│   ├── seed.js                      # Demo data seeder
│   ├── app.js                       # Express app + middleware + routes
│   ├── server.js                    # Entry point
│   └── package.json
│
└── README.md
```

## 📄 Environment Variables

### Server `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cabbooking
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Client `.env` (optional)
```
VITE_API_URL=http://localhost:5005/api
```
If not set, API calls default to `/api` (works with Vite proxy in dev).

## 🎯 Key Design Decisions

- **Optimistic UI**: Ride booking, cancellation, and rating show immediate feedback, then reconcile with server response
- **Applied Search**: Search inputs don't trigger API calls on every keystroke — only on Enter or Search button click
- **Dropdown Menus**: Uses `mousedown` + `useRef` + `contains()` pattern for reliable outside-click detection (avoids React synthetic event issues)
- **Dark Mode**: CSS custom properties on `:root` and `.dark`, toggled by ThemeContext, persisted to `localStorage`
- **Toast Safety**: Toast calls moved outside React state updaters to prevent double-fire in StrictMode
- **Auth Flattening**: Backend returns `{ user: {...}, token }`, flattened to `{ ...userData, token }` so `user.name` works directly

## 📋 Not Yet Implemented

- Automated tests
- Real map integration (distance/duration is simulated)
- WebSocket live ride tracking
- Scheduled rides
- Multi-stop rides
