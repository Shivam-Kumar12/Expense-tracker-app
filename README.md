# Expense Tracker

A full-stack expense tracking application built with React (Vite) and Node.js/Express.

## Project Structure

```
expense-tracker-app/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── styles/             # Component styles
│   │   ├── App.jsx             # Main App component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/                     # Node.js/Express API
│   ├── server.js               # Main server file
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── README.md
│
└── README.md                    # This file
```

## Features

- ✅ Add, view, and delete expenses
- ✅ Filter expenses by category and month
- ✅ View expense statistics (total, average, by category)
- ✅ Responsive design (mobile & desktop)
- ✅ Beautiful UI with gradient theme

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`

## Technology Stack

**Frontend:**
- React 19
- Vite
- CSS3

**Backend:**
- Node.js
- Express.js
- CORS enabled

## Available Scripts

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm run preview` - Preview production build

### Backend
- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-reload)

## API Documentation

See [Backend README](./backend/README.md) for detailed API documentation.

## License

ISC
