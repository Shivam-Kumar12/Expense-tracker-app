# Expense Tracker Backend

Node.js + Express + MongoDB API for the Expense Tracker application with authentication and admin features.

## Prerequisites

- Node.js (v16+)
- MongoDB (running locally or connection string)
- npm or yarn

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
ADMIN_SECRET=admin_secret_key_123
```

## Running

Development mode with hot reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Profile
```
GET /api/auth/profile
Headers: Authorization: Bearer jwt_token_here
Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Profile
```
PUT /api/auth/profile
Headers: Authorization: Bearer jwt_token_here
Body: {
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

---

### Expense Routes (`/api/expenses`)

#### Add Expense
```
POST /api/expenses
Headers: Authorization: Bearer jwt_token_here
Body: {
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "paymentMethod": "Card",
  "tags": ["lunch", "restaurant"]
}
Response:
{
  "success": true,
  "message": "Expense added successfully",
  "expense": {
    "_id": "expense_id",
    "userId": "user_id",
    "amount": 50.00,
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2024-01-15",
    "paymentMethod": "Card",
    "tags": ["lunch", "restaurant"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get User Expenses
```
GET /api/expenses?category=Food&page=1&limit=10
Headers: Authorization: Bearer jwt_token_here
Query Params:
  - category: Filter by category (optional)
  - startDate: Filter by start date (optional)
  - endDate: Filter by end date (optional)
  - page: Page number (default: 1)
  - limit: Results per page (default: 10)

Response:
{
  "success": true,
  "count": 5,
  "total": 25,
  "pages": 3,
  "currentPage": 1,
  "expenses": [...]
}
```

#### Get Expense by ID
```
GET /api/expenses/:id
Headers: Authorization: Bearer jwt_token_here
```

#### Update Expense
```
PUT /api/expenses/:id
Headers: Authorization: Bearer jwt_token_here
Body: {
  "amount": 60.00,
  "category": "Food",
  "description": "Updated lunch cost",
  "date": "2024-01-15"
}
```

#### Delete Expense
```
DELETE /api/expenses/:id
Headers: Authorization: Bearer jwt_token_here
```

#### Get Expense Statistics
```
GET /api/expenses/stats
Headers: Authorization: Bearer jwt_token_here
Response:
{
  "success": true,
  "stats": {
    "totalExpenses": 500.00,
    "averageExpense": 50.00,
    "highestExpense": 150.00,
    "lowestExpense": 10.00,
    "totalCount": 10
  },
  "byCategory": [
    {
      "_id": "Food",
      "total": 300,
      "count": 6
    },
    {
      "_id": "Transport",
      "total": 200,
      "count": 4
    }
  ]
}
```

---

### Admin Routes (`/api/admin`)

**All admin routes require:**
- Authorization header with valid JWT token
- User must have `role: "admin"`

#### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer admin_jwt_token
Response:
{
  "success": true,
  "count": 5,
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Deactivate User
```
PUT /api/admin/users/:userId/deactivate
Headers: Authorization: Bearer admin_jwt_token
Response:
{
  "success": true,
  "message": "User deactivated successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": false
  }
}
```

#### Get All Expenses (Admin)
```
GET /api/admin/expenses?userId=user_id&category=Food&page=1&limit=10
Headers: Authorization: Bearer admin_jwt_token
```

#### Get System Statistics
```
GET /api/admin/stats
Headers: Authorization: Bearer admin_jwt_token
Response:
{
  "success": true,
  "totalUsers": 10,
  "totalExpenses": 250,
  "stats": {
    "totalAmount": 5000.00,
    "averageExpense": 50.00
  },
  "byCategory": [
    {
      "_id": "Food",
      "total": 2000,
      "count": 40
    }
  ],
  "topUsers": [
    {
      "_id": "user_id",
      "total": 500,
      "count": 10,
      "user": [
        {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ]
    }
  ]
}
```

---

## Expense Categories

- Food
- Transport
- Entertainment
- Utilities
- Shopping
- Other

## Payment Methods

- Cash
- Card
- Bank Transfer
- Other

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## User Roles

- **user**: Regular user - can manage their own expenses
- **admin**: Administrator - can manage all users and expenses, view system statistics

## Database Schema

### User Model
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed with bcryptjs)
- role (String, enum: ['user', 'admin'], default: 'user')
- isActive (Boolean, default: true)
- createdAt (Date, auto)
- updatedAt (Date, auto)

### Expense Model
- userId (ObjectId, required, references User)
- amount (Number, required)
- category (String, required, enum of categories)
- description (String, required)
- date (Date, required)
- paymentMethod (String, enum of payment methods)
- tags (Array of Strings)
- createdAt (Date, auto)
- updatedAt (Date, auto)

## License

ISC
