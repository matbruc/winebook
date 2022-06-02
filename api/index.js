import express from 'express';
import mongoose from "mongoose";

import { usersRoute, producersRoute, reviewsRoute, winesRoute } from './routes/index.js';
const app = express();

// Environment variables
const port = 9000;
const dbName = "winedb";
const dbHost = "localhost";
const dbPort = 27017;

// Connect to MongoDB
const url = `mongodb://${dbHost}:${dbPort}/${dbName}`;
mongoose.connect(url, {useNewUrlParser: true});
const con = mongoose.connection;

app.use(express.json());
app.use('/api/users', usersRoute);

try{
    con.on('open',() => {
        console.log('connected');
    })
}catch(error)
{
    console.log("Error: "+error);
}

app.listen(port, () =>{
    console.log('Server started');
})