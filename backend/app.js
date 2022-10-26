const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config({ path: 'backend/config/config.env' });

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
/**************************************************Route Imports*****************************************************************************/
const blog = require('./routes/blogRoute');
const user = require('./routes/userRoute');




//PRODUCT ROUTE
app.use("/api/v1", user);
// app.use("/api/v1", blog);



/*************************************************** MIDDLEWARE*******************************************************/
app.use(errorMiddleware);


module.exports = app;