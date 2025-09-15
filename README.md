🏛️ Samanyay — AI-Powered Legal Research Platform
📌 Overview

Samanyay is a full-stack legal tech platform built as part of an internship coding challenge.
It provides:

Secure user authentication

Private case management with file uploads

Payment gateway integration for Pro accounts

The platform is built with a React + Express + MongoDB stack.

⚡ Features
🔐 User Authentication & Profile

Email/password registration with validation

Secure login with JWT session tokens

Protected routes for authenticated users

Passwords securely hashed with bcrypt

Auth middleware for route protection

📁 Case Management System

Personal dashboard showing only logged-in user’s cases

Create cases with title, description, and file uploads (PDF/docs)

Files uploaded and stored on the server

Real-time case fetching from the backend

Users cannot see cases created by others

💳 Payment Gateway Integration

Stripe (test mode) payment flow

“Upgrade to Pro” button on dashboard

On payment success, backend updates user.isPro = true

Pro account status persisted in DB

🏗️ Architecture

Monorepo-style structure:

.
├── Samanyay.Ai/          # Frontend (React + TS + Vite)
│   ├── src/
│   │   ├── pages/         # Landing, Login, Register, Dashboard, Payment, NotFound
│   │   ├── components/ui/ # ShadCN-style UI components
│   │   └── lib/api.ts     # Axios client with baseURL + auth token
│   └── .env               # VITE_API_URL
│
└── server/                # Backend (Express + MongoDB)
    ├── server.js           # Entry point
    ├── config/db.js         # MongoDB connection
    ├── models/User.js       # { email, password(hashed), isPro }
    ├── models/Case.js       # { userId, title, description, fileUrl }
    ├── middleware/authMiddleware.js
    ├── controllers/
    │   ├── authController.js
    │   ├── caseController.js
    │   └── paymentController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── caseRoutes.js
    │   └── paymentRoutes.js
    ├── uploads/              # Stored user-uploaded files
    └── .env

🗃️ Database Schema
User
{
  email: String,
  password: String,  // bcrypt hashed
  isPro: Boolean
}

Case
{
  userId: ObjectId,  // Reference to User
  title: String,
  description: String,
  fileUrl: String    // Path to uploaded file
}

⚙️ Setup Instructions
📦 Backend (server/)
cd server
npm install


Create a .env file inside server/:

PORT=5000
DB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_test_key
CORS_ORIGIN=http://localhost:8080


Then run:

npm run dev

💻 Frontend (Samanyay.Ai/)
cd Samanyay.Ai
npm install


Create a .env file inside Samanyay.Ai/:

VITE_API_URL=http://localhost:5000/api


Then run:

npm run dev


Frontend will start at http://localhost:8080

📡 API Documentation
Method	Endpoint	Description	Auth
POST	/api/auth/register	Register new user	❌
POST	/api/auth/login	Login user, returns {token, user}	❌
GET	/api/cases	Get all cases for logged-in user	✅
POST	/api/cases	Create a case (multipart: title, description, file)	✅
POST	/api/payment/checkout	Simulate payment, sets isPro=true	✅
GET	/api/health	Health check	❌

Use the Authorization: Bearer <token> header for protected endpoints.

🧪 Demo Credentials
Email: demo@lawfirm.com
Password: demo123

📱 Usage Flow

Register or log in (demo account available)

Access the dashboard

Create new cases and upload files

Upgrade to Pro via the payment page

Reload dashboard to see Pro status