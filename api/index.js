import 'dotenv/config'
import mongoose from "mongoose";
import createServer from "./server.js";

// Environment variables
const port = process.env.API_PORT;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const app = createServer();
// Connect to MongoDB
const url = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
try{
    mongoose.connection.on('open',() => {
        console.log('connected');
    })
}catch(error)
{
    console.log("Error: "+error);
}

app.listen(port, () =>{
    console.log('Server started');
})
