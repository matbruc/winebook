# winebook

wine reviews notebook for wine tasters and people that enjoy good wines

## Running with Docker (Recommended)

This project can be easily run using Docker Compose, eliminating the need to install MongoDB locally.

### Prerequisites
1. Install [Docker](https://www.docker.com/products/docker-desktop/)
2. Install [Docker Compose](https://docs.docker.com/compose/install/)

### Quick Start
1. Clone or download this repository
2. Create a `.env` file in the root directory with the following content:
```
MONGO_ROOT_PASSWORD=rootpassword
MONGO_DB_NAME=winedb
MONGO_DB_USER=root
MONGO_DB_PASSWORD=
JWT_TOKEN_KEY=supersecretkey
```
3. Run `docker-compose up -d` in the project root directory

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:9000
- MongoDB: localhost:27017

## Manual Setup (Alternative)

### Prerequisites
1. Install [Node.js](https://nodejs.org/en/)
2. Install [React](https://reactjs.org/).
3. Install [MongoDB](https://www.mongodb.com/download-center)

### Setup Instructions
1. Run mongo and create a database called winedb.
2. Run `mongorestore --uri 'mongodb://localhost:27017/winedb' --archive=winedb-dump --gzip`
3. Update `.env` file in `api` and `client` folders with your MongoDB credentials.
4. Run `npm install` in `api` and `client` folders.
5. Run `npm start` in `api` folder.
6. Run `npm start` in `client` folder.
7. Open `http://localhost:3000/` in your browser.

#### Test Users Credentials

- User without admin: testuser@test.com / Test123
- User with admin: testadmin@test.com / Test123

### Tests

1. Run `npm test` in `api` folder.
