const express = require("express");
const GoogleUser = require("./models/google");
const cors = require("cors");
const app = express();
const path = require("path");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
/////////////////////////////////////////////////////
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
//const fileUpload = require("express-fileupload");
require("dotenv").config({ path: "config/config.env" });
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json());

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

//app.use(cors(corsOptions));
app.use(cors(corsOptions));

//************************SECURITY CHECKS************************************ */
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "data:", "blob:"],

      fontSrc: ["'self'", "https:", "data:"],

      scriptSrc: ["'self'", "unsafe-inline"],

      scriptSrc: ["'self'", "https://*.cloudflare.com"],

      scriptSrcElem: ["'self'", "https:", "https://*.cloudflare.com"],

      styleSrc: ["'self'", "https:", "unsafe-inline"],

      connectSrc: ["'self'", "data", "https://*.cloudflare.com"],
    },
  })
);
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: "Toomany request from this IP , try again after 1 hour",
});
app.use("/api", limiter);
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//******************************************************************************* */

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(fileUpload());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//***********************Google Auth MiddleWare**********************/
const cookieSession = require("cookie-session");
const passport = require("passport");
passport.serializeUser(function (user, done) {
  console.log(user);
  console.log(user._json.name);
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
const googleRouter = require("./routes/googleRouter");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const config = {
  CLIENT_ID: process.env.GOOGLE_ID,
  CLIENT_SECRET: process.env.GOOGLE_SECRET,
};

const AUTH_OPTIONS = {
  callbackURL: "https://35.174.115.137:3006/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

const verifyCallback = async (accessToken, refreshToken, profile, cb) => {
  //console.log("google_profile", profile);

  cb(null, profile);
  //
  if (!(await GoogleUser.findOne({ email: profile._json.email }))) {
    await GoogleUser.create({
      email: profile._json.email,
      name: profile._json.name,
      id: profile.id,
    });
  }
  //
};

passport.use(new GoogleStrategy(AUTH_OPTIONS, verifyCallback));

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SOCIAL_COOKIE_SECRET_GOOGLE],

    // Cookie Options
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(googleRouter);

//
//**************************************Common MiddleWare Of Passport*************************/
app.use(passport.initialize());
app.use(passport.session());

app.use(googleRouter);
/**************************************************Route Imports*****************************************************************************/
const blog = require("./routes/blogRoute");
const user = require("./routes/userRoute");
const newsLetterUser = require("./routes/newsLetterUserRoute");
app.use((req, res, next) => {
  //console.log(req.cookies);
  console.log(req.headers);
  next();
});
//PRODUCT ROUTE
app.use("/api/v1", user);
app.use("/api/v1", blog);
app.use("/api/v1", newsLetterUser);

/*************************************************** MIDDLEWARE*******************************************************/
app.use(errorMiddleware);

module.exports = app;
