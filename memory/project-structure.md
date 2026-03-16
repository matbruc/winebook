# Winebook Project Structure

## Overview
A web application for registering and reviewing wines. Full-stack app with React frontend and Express/MongoDB backend.

## Technology Stack
- **Frontend**: React 18 (Create React App), Bootstrap 5, React Router 6, Axios
- **Backend**: Node.js + Express, MongoDB with Mongoose 6
- **Auth**: JWT + bcryptjs

## Project Structure
```
winebook/
├── client/               # React Frontend (port 3000)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home/index.js
│   │   │   ├── Login/index.js
│   │   │   ├── Signup/index.js
│   │   │   ├── Producers/Producer.js, ProducersForm.js, ProducersList.js
│   │   │   ├── Wines/Wine.js, WinesForm.js, WinesList.js
│   │   │   └── Reports/ReportsHome.js, WinesReport.js
│   │   ├── services/
│   │   │   ├── AuthService.js
│   │   │   ├── WinesService.js
│   │   │   ├── ProducerService.js
│   │   │   ├── UserService.js
│   │   │   └── ReportsService.js
│   │   ├── App.js              # Main router
│   │   └── index.js            # Entry point
│   └── public/
├── api/                    # Express Backend (port 9000)
│   ├── controllers/
│   │   ├── index.js
│   │   ├── users.js
│   │   ├── wines.js
│   │   ├── producers.js
│   │   ├── reviews.js
│   │   └── reports.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── users.js
│   │   ├── wines.js
│   │   ├── producers.js
│   │   ├── reviews.js
│   │   └── reports.js
│   ├── models/
│   │   ├── userdata.js
│   │   ├── winedata.js
│   │   ├── reviewdata.js
│   │   └── producerdata.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── index.js
│   ├── server.js           # Express app factory
│   └── index.js            # Entry point with server startup
├── winedb-dump/            # MongoDB dump (gzipped archive)
└── docker-compose.yml      # Docker deployment
```

## API Endpoints
- POST `/api/register` - User registration
- POST `/api/login` - User login
- GET `/api/users/:id` - Get user by ID
- POST `/api/users/admin-only` - Admin only endpoint
- GET `/api/producers/` - List all producers
- POST `/api/producers` - Create producer
- GET `/api/producers/:producerID/reviews` - Get producer reviews
- GET `/api/reviews/` - List all reviews
- POST `/api/reviews` - Create review
- GET `/api/reviews/:id` - Get review by ID
- GET `/api/wines/` - List all wines
- POST `/api/wines` - Create wine
- GET `/api/wines/:wineID/reviews` - Get wine reviews
- GET `/api/reports/` - List reports

## Docker Setup
```
mongo-data:          # MongoDB volume
winebook-mongo:      # MongoDB 6.0
winebook-api:        # Backend (port 9000)
winebook-client:     # Frontend (port 3000)
```

## Test Users
- Standard user: testuser@test.com / Test123
- Admin: testadmin@test.com / Test123

## Dependencies - Backend (api/package.json)
```
bcryptjs:     ^3.0.3   (current)
cors:         ^2.8.5   (current)
dotenv:       ^16.4.7  (current)
express:      ^4.22.1  (current)
jsonwebtoken: ^9.0.3   (current)
mongoose:     ^6.13.9  (current)

@babel/preset-env:     ^7.26.0 (current)
jest:                  ^29.7.0 (current)
supertest:              ^7.0.0 (current)
```

## Dependencies - Frontend (client/package.json)
```
@testing-library/jest-dom:      ^5.16.4  (current)
@testing-library/react:        ^13.3.0  (current)
@testing-library/user-event:   ^13.5.0  (current)
axios:                          ^1.13.6  (current - VERY OUTDATED)
bootstrap:                      ^5.3.3   (current)
react:                          ^18.1.0  (current)
react-bootstrap:                ^2.4.0   (current)
react-dom:                      ^18.1.0  (current)
react-google-charts:            ^4.0.0   (current)
react-router-dom:              ^6.30.3   (current - very outdated, major version)
react-scripts:                  ^5.0.1   (current)
react-simple-star-rating:       ^4.0.5   (current)
react-validation:               ^3.0.7   (OUTDATED - deprecated)
validator:                     ^13.15.20  (current)
web-vitals:                     ^2.1.4   (current)
```

## Old Dependencies Identified
1. **react-google-charts ^4.0.0** - Very old, should upgrade to ^5.0.0 or higher
2. **react-validation ^3.0.7** - Deprecated, no longer maintained
3. **react-router-dom ^6.30.3** - Versioning issue (should be ^6.0.0+)
4. **axios ^1.13.6** - Versioning issue (likely typo, should be ~1.6.x)

## Common Tasks
- Run tests: `cd api && npm test`
- Start dev backend: `cd api && npm start`
- Start dev frontend: `cd client && npm start`
- Docker up: `docker-compose up -d`
- Docker down: `docker-compose down`
- Restore DB dump: `mongorestore --uri 'mongodb://localhost:27017/winedb' --archive=winedb-dump --gzip`
