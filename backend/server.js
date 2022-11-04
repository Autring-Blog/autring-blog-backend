const app = require('./app');
// const dotenv = require('dotenv');  USED BELOW IN IF CASE
const connectToMongo = require('./config/database');


/************************************HANDLING UNCOUGHT ERROR/EXCEPTION ************************************************/
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to UNCOUGHT ERROR/EXCEPTION ');
    server.close(() => {
        process.exit(1);
    });

});


//CONFIG 

require('dotenv').config({ path: 'config/config.env' });

//CONNECT TO DATABASE
connectToMongo();

const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
})
// console.log(youtube);
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled Promise');
    server.close(() => {
        process.exit(1);
    });

});