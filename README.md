# Backend for SmartSpend

This is the backend server for the SmartSpend application. It is built with Node.js, TypeScript, and Express, and provides RESTful API endpoints for authentication and expense management.

## Technologies and Dependencies

- Node.js with TypeScript
- Express 5
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- dotenv for environment variable management
- cors and cookie-parser middleware
- nodemailer for email functionality

## Installation and Setup

1. Clone the repository and navigate to the `Backend` directory:

   ```bash
   cd Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` directory with the following environment variables:
   ```
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```

## Running the Server

### Development Mode

Run the server with hot-reloading using nodemon:

```bash
npm run dev
```

The server will start on the port specified in `.env` or default to 8000.

### Production Mode

Build the TypeScript files and start the compiled server:

```bash
npm run build
npm start
```

## API Routes Overview

- **Authentication Routes** (`/auth`):

  - Handles user registration, login, password reset, and related authentication features.

- **Expense Routes** (`/expense`):
  - Handles CRUD operations for user expenses.

## Database Connection

The backend connects to a MongoDB database using Mongoose. The connection string should be provided in the `MONGO_URI` environment variable.

## Testing the API

To verify the server is running, send a GET request to the root endpoint:

```
GET /
```

You should receive a response:

```
API is running successfully. 😎
```

---

For more details on API endpoints and usage, please refer to the source code in the `server/routes` directory.
