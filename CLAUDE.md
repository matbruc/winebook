# Winebook - Reference Project

## Description
Web application for registering and reviewing wines, designed for wine lovers.

## Technology Stack
- **Frontend**: React 18 (Create React App), Bootstrap 5, React Router, Axios
- **Backend**: Node.js + Express, MongoDB (Mongoose)
- **Auth**: JWT + bcryptjs

## Project Structure
```
/winebook
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/   # Components (Wines, Producers, Reports, Login, Signup, Home)
│   │   ├── services/     # API services (Auth, Wines, Producers, User, Reports)
│   │   ├── App.js        # Main router
│   │   └── index.js      # Entry point
│   └── public/
├── api/             # Express Backend
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── models/           # Mongoose models
│   ├── middlewares/      # Auth middleware
│   └── index.js          # Entry point
└── winedb-dump/     # MongoDB dump
```

## Commands
```bash
# Install dependencies
cd api && npm install
cd client && npm install

# Start backend (port 9000)
cd api && npm start

# Start frontend (port 3000)
cd client && npm start

# API Tests
cd api && npm test
```

## Test Credentials
- User: testuser@test.com / Test123
- Admin: testadmin@test.com / Test123

## Database Configuration
1. Make sure MongoDB is running locally
2. Run `mongorestore --uri 'mongodb://localhost:27017/winedb' --archive=winedb-dump --gzip` to restore the database
3. Update the `.env` files in `/api` and `/client` folders with your MongoDB credentials

## Additional Notes
- The project has some outdated dependencies that may need updating for security and compatibility
- Requires local MongoDB running
- .env files in /api and /client need database configuration
- It's recommended to update dependencies for improved security and compatibility
