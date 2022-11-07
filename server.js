const mongoose = require("mongoose");

const app = require("./app");

const fs = require("fs");
//const http = require("http");

// const options = {
//   key: fs.readFileSync("ssl/key.pem"),
//   cert: fs.readFileSync("ssl/cert.pem"),
// };
// const dotenv = require('dotenv');  USED BELOW IN IF CASE
//const connectToMongo = require('./config/database');

/************************************HANDLING UNCOUGHT ERROR/EXCEPTION ************************************************/
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to UNCOUGHT ERROR/EXCEPTION ");
  server.close(() => {
    process.exit(1);
  });
});

//CONFIG

require("dotenv").config({ path: "config/config.env" });

//CONNECT TO DATABASE
const DB = process.env.DB_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log("DB Connection Successful");
});
// const server = app.listen(process.env.PORT, () => {
//   console.log(`server is running on https://localhost:${process.env.PORT}`);
// });

const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on https://localhost:${process.env.PORT}`);
});

// console.log(youtube);
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled Promise");
  server.close(() => {
    process.exit(1);
  });
});
