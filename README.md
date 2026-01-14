<<<<<<< HEAD
# ShareSwap - Barter & Rental Platform

A platform for sharing expensive items through barter or rental to reduce financial waste and environmental impact.

## Features

- **Full CRUD Operations**: Create, read, update, and delete item listings
- **Item Listings**: Add items with images, descriptions, categories, and pricing
- **Barter & Rental**: Support for both barter exchanges and rental pricing
- **Smart Matching**: Algorithm suggests compatible swaps based on category, type, and ratings
- **Rating & Reviews**: Users can rate and review items to build trust
- **Responsive Design**: Clean, modern interface that works on all devices

## Getting Started
=======
# Campus Resource Management System

A complete full-stack application for managing campus resources like labs, halls, and equipment with real-time booking and admin management.

## Features

### Core Features
- **Searchable Resource Catalog** - Browse and search resources by name, type, and availability
- **Real-time Availability Calendar** - View booked slots and available time slots
- **Slot Booking System** - Book resources with backend validation to prevent double-booking
- **Admin Dashboard** - Approve/decline bookings and manage resources (CRUD operations)
- **Email Notifications** - Automated email notifications for booking status updates

### Additional Features
- User authentication (JWT-based)
- Role-based access control (Student, Faculty, Admin)
- Booking conflict detection
- Resource capacity validation
- Operating hours enforcement
- Booking duration limits

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Email notifications)
- Express Validator

### Frontend
- React 18
- React Router
- Axios
- React Calendar
- React Toastify

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup
>>>>>>> 2041a0abaf080be103d7cefdf3fe59e1909de973

1. Install dependencies:
```bash
npm install
```

<<<<<<< HEAD
2. Start the development server:
=======
2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-resources
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Start MongoDB

5. Run the server:
>>>>>>> 2041a0abaf080be103d7cefdf3fe59e1909de973
```bash
npm run dev
```

<<<<<<< HEAD
3. Open http://localhost:3000 in your browser

## Usage

- **Browse Items**: View all available items with ratings and details
- **List Item**: Add your own items for barter or rental
- **Smart Matches**: See algorithm-suggested swaps based on compatibility
- **Reviews**: Rate and review items to help build community trust

## Tech Stack

- React 18
- Vite
- React Router
- CSS3
=======
### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

### User Registration
1. Register with email, phone, name, and password
2. Login to access the dashboard

### Booking Resources
1. Browse resources from the catalog
2. Click on a resource to view details
3. Select a date from the calendar
4. Choose time slot and enter booking details
5. Submit booking request

### Admin Functions
1. Login with admin credentials
2. Access Admin Dashboard
3. Manage bookings (approve/decline)
4. Manage resources (create/update/delete)
5. View statistics

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Resources
- GET `/api/resources` - Get all resources (with filters)
- GET `/api/resources/:id` - Get resource details
- GET `/api/resources/:id/availability` - Get resource availability

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get user bookings
- PATCH `/api/bookings/:id/cancel` - Cancel booking

### Admin
- GET `/api/admin/bookings` - Get all bookings
- PATCH `/api/admin/bookings/:id/approve` - Approve booking
- PATCH `/api/admin/bookings/:id/decline` - Decline booking
- POST `/api/admin/resources` - Create resource
- PUT `/api/admin/resources/:id` - Update resource
- DELETE `/api/admin/resources/:id` - Delete resource
- GET `/api/admin/dashboard/stats` - Get dashboard statistics

## Default Admin Account

Create an admin user manually in MongoDB or modify the User model to set role as 'admin' during registration.

## License

MIT
>>>>>>> 2041a0abaf080be103d7cefdf3fe59e1909de973
