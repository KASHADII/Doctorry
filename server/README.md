# Doctorry Server Setup

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doctorry?retryWrites=true&w=majority
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string from "Connect" → "Connect your application"
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `doctorry`
6. Update the `MONGODB_URI` in your `.env` file

## Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── errorHandler.js     # Global error handling
├── models/
│   └── User.js             # User schema and model
├── routes/
│   ├── auth.js             # Authentication routes (register, login, logout)
│   └── user.js             # User profile routes
├── index.js                # Main server file
├── package.json
└── .env                    # Environment variables (create this file)
```

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Profile
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)

### Health Check
- `GET /api/health` - Server health check
