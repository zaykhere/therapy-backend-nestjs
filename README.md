<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  <h1>🛋️ SafeSpace - Therapist Booking System API</h1>
  <p>A robust and scalable backend API for a modern therapist booking application built with NestJS and TypeScript.</p>

  <div>
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
    <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  </div>
</div>

<br />

## 🚀 Overview

**SafeSpace** is the core backend infrastructure powering a comprehensive therapist booking platform. It handles everything from user authentication and profile management to appointment scheduling, therapy questionnaire processing, and secure payments integration.

Built on the progressive **NestJS** framework, the application utilizes modern backend patterns, dependency injection, and a modular architecture to ensure high maintainability and scalability.

## ✨ Key Features

- **🔐 Authentication & Authorization:** Secure user sign-up and login utilizing JWT (JSON Web Tokens) and Passport.
- **👤 Profile Management:** Distinct handling of different user roles (patients and therapists) with comprehensive profile management.
- **📅 Appointment Scheduling:** Seamless booking, tracking, and management of therapy sessions.
- **📝 Therapy Questionnaires:** Dynamic endpoints to manage therapy types and related evaluation questions.
- **💳 Secure Payments:** Integrated with **Stripe** to process secure transaction flows for therapy bookings.
- **📧 Email Notifications:** Automated transactional email delivery powered by **Nodemailer**.
- **🗃️ Database Architecture:** Robust relational data structure utilizing **PostgreSQL** and **TypeORM**.
- **📖 Interactive API Docs:** Fully documented API endpoints accessible via **Swagger UI**.

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Express-based)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport.js, bcrypt
- **Payments Integration**: Stripe API
- **Mailing**: Nodemailer
- **Testing**: Jest, Supertest

## ⚙️ Getting Started

Follow these steps to set up the project locally for development and testing.

### Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18.x or higher)
- **npm** (or yarn/pnpm)
- **PostgreSQL** (running locally or via Docker)
- **Stripe Account** (for API keys)

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <repository-url>
   cd therapy-backend-nestjs-master
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Environment Config

Create a `.env` file in the root of the project and provide the following environment variables (adjust values as needed for your setup):

```env
# Application Port
PORT=5000

# Database Configuration (TypeORM)
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=safespace_db

# Security
JWT_SECRET=your_super_secret_jwt_key

# Stripe Payment Gateway
STRIPE_API_KEY=your_stripe_secret_key

# SMTP / Email Configuration
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

### Running the Application

```bash
# development
$ npm run start

# watch mode (auto-reload)
$ npm run start:dev

# production mode
$ npm run start:prod
```

The application will start globally on `http://localhost:5000` (or whatever `PORT` you specified). CORS is configured to accept requests from `http://localhost:3000` out of the box.

## 📚 API Documentation

Once the server is running, you can explore the interactive API documentation and test endpoints directly via Swagger UI:

👉 **[http://localhost:5000/api/docs](http://localhost:5000/api/docs)**

## 🧪 Testing

The repository uses Jest for both unit testing and end-to-end (e2e) testing.

```bash
# Run unit tests
$ npm run test

# Run e2e tests
$ npm run test:e2e

# Generate test coverage report
$ npm run test:cov
```

## 📜 License

This project is set as [UNLICENSED](package.json). Please refer to the author for usage rights.

---
> *Looking to build scalable, enterprise-grade backends? Let's connect!*
