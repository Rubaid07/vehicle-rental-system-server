# Vehicle Rental System

A backend-only Vehicle Rental System built with **Node.js**, **Express**, and **PostgreSQL**, using a modular MVC-style folder structure. This project is part of an assignment submission.

---

## Live Links

Live Deployment: https://vehicle-rental-system-server-pi.vercel.app/

---

## Features

### Authentication & Authorization

* User Registration & Login (JWT Based)
* Role-based access control: `admin`, `customer`

### User Management (Admin Only)

* Get All Users
* Get Single User
* Update User
* Delete User

### Vehicle Management

* Create Vehicle (Admin)
* Get All Vehicles
* Get Single Vehicle
* Update Vehicle (Admin)
* Delete Vehicle (Admin)

### Booking Management

* Create Booking
* Get All Bookings (Admin)
* Get User's Own Bookings
* Cancel Booking
* Prevents double-booking

---

## Tech Stack

* **Node.js**
* **Express.js**
* **PostgreSQL** (pg package)
* **JWT Authentication**
* **TypeScript**

---

## 📁 Folder Structure

```
VEHICLE RENTAL SYSTEM
├── node_modules
├── src
│   ├── config
│   ├── middleware
│   ├── modules
│   │   ├── auth
│   │   ├── booking
│   │   ├── user
│   │   └── vehicle
│   ├── types
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## Project Setup Instructions

### 1️. Clone the Repo

```
git clone <repo-url>
cd vehicle-rental-system
```

### 2️. Install Dependencies

```
npm install
```

### 3️. Environment Variables

Create a `.env` file:

```
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/vehicle_rental
JWT_SECRET=yourSecretKey
```

### 4️. Start Server

```
npm run dev
```

Server runs at:

```
http://localhost:5000
```

