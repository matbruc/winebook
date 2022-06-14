# winebook

wine reviews notebook for wine tasters and people that enjoy good wines

## Instructions
1. Install [Node.js](https://nodejs.org/en/)
2. Install [React](https://reactjs.org/).
3. Install [MongoDB](https://www.mongodb.com/download-center)
4. Run mongo and create a database called winedb.
5. Run `mongorestore --uri 'mongodb://localhost:27017/winedb' --archive=winedb-dump --gzip`
6. Update `.env` file in `api` and `client` folders with your MongoDB credentials.
7. Run `npm install` in `api` and `client` folders.
8. Run `npm start` in `api` folder.
9. Run `npm start` in `client` folder.
10. Open `http://localhost:3000/` in your browser.

### Tests

1. Run `npm test` in `api` folder.
