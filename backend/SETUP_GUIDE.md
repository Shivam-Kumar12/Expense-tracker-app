# Expense Tracker Backend - Setup Guide

## Prerequisites

Before you start, make sure you have:
- Node.js v16 or higher
- MongoDB (either local installation or MongoDB Atlas cloud)
- npm or yarn
- Postman (optional, for API testing)

## Installation Steps

### 1. Navigate to Backend Directory
```bash
cd d:\python\expense-tracker-app\backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- **express** - Web server framework
- **mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **express-validator** - Input validation
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload

### 3. Set Up MongoDB

#### Option A: Local MongoDB
1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Default connection string: `mongodb://localhost:27017/expense-tracker`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` file

### 4. Configure Environment Variables

Edit `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
ADMIN_SECRET=admin_secret_key_123
```

**Important**: Change `JWT_SECRET` to a strong random string for production!

### 5. Start the Server

#### Development Mode (with auto-reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

You should see:
```
MongoDB connected successfully
Server running on http://localhost:5000
Environment: development
```

## Testing the API

### Method 1: Using Postman

1. Import the Postman collection: `ExpenseTracker.postman_collection.json`
2. Set the base URL to `http://localhost:5000`
3. Replace placeholders like `YOUR_JWT_TOKEN_HERE` with actual tokens
4. Test endpoints

### Method 2: Using cURL

#### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Copy the returned JWT token and use it in subsequent requests:

#### Add an expense:
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "category": "Food",
    "description": "Lunch",
    "date": "2024-01-15",
    "paymentMethod": "Card"
  }'
```

## File Structure

```
backend/
├── models/
│   ├── User.js              # User schema with authentication
│   └── Expense.js           # Expense schema
├── controllers/
│   ├── userController.js    # Auth & user management
│   └── expenseController.js # Expense operations
├── middleware/
│   ├── auth.js              # JWT verification & role authorization
│   └── errorHandler.js      # Error handling middleware
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── expenseRoutes.js     # Expense endpoints
│   └── adminRoutes.js       # Admin endpoints
├── server.js                # Main server file
├── package.json
├── .env                     # Environment variables (create this)
└── README.md                # API documentation
```

## Key Features

### Authentication
- ✅ User registration with email validation
- ✅ Login with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Token expiration (7 days)

### User Management
- ✅ Profile view
- ✅ Profile updates
- ✅ Account status management
- ✅ Role-based access control

### Expense Management
- ✅ Create expenses with details
- ✅ Read/View all user expenses
- ✅ Update expense information
- ✅ Delete expenses
- ✅ Filter by category and date
- ✅ Pagination support

### Admin Features
- ✅ View all users
- ✅ Deactivate user accounts
- ✅ View all expenses in the system
- ✅ System-wide statistics
- ✅ Top spenders list

### Security
- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Protected routes with middleware
- ✅ Role-based authorization
- ✅ Input validation with express-validator
- ✅ CORS enabled for cross-origin requests

## Troubleshooting

### MongoDB Connection Error
- **Issue**: `MongooseError: connect ECONNREFUSED`
- **Solution**: 
  - Make sure MongoDB is running
  - Check connection string in `.env`
  - For MongoDB Atlas, add your IP to whitelist

### JWT Token Errors
- **Issue**: "Not authorized to access this route"
- **Solution**: Make sure token is included in Authorization header:
  ```
  Authorization: Bearer your_token_here
  ```

### Port Already in Use
- **Issue**: `Error: listen EADDRINUSE: address already in use :::5000`
- **Solution**: Change PORT in `.env` or kill the process using port 5000

### Validation Errors
- **Issue**: 400 Bad Request with validation errors
- **Solution**: Check the error message and ensure all required fields are provided with correct formats

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment type | development/production |
| `MONGODB_URI` | MongoDB connection | mongodb://localhost:27017/expense-tracker |
| `JWT_SECRET` | JWT signing secret | any_random_string |
| `JWT_EXPIRE` | Token expiration time | 7d |
| `ADMIN_SECRET` | Admin verification secret | any_string |

## Next Steps

1. **Connect Frontend**: Update frontend to use `http://localhost:5000` as API base URL
2. **Deploy**: Push to production using platforms like Heroku, Railway, or DigitalOcean
3. **Database Backup**: Set up MongoDB backups
4. **Security**: Update JWT_SECRET for production
5. **Monitoring**: Add logging and monitoring tools

## Support

For detailed API documentation, see `README.md` in this directory.

For frontend integration guide, see the main project `README.md`.
