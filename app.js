const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
require("dotenv").config();
const cors = require("cors");
const passport = require("passport");
const { emailInternalHelper } = require("./helpers/email");
require("./helpers/passport");

const app = express();
app.use(passport.initialize());
mongoose
  .connect(process.env.DB_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB database connection established successfully!`);
    emailInternalHelper.createTemplatesIfNotExists();
  })
  .catch((err) => console.error("Could not connect to database!", err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/api", indexRouter);

// const fake = require("./fakeData");
// fake.createUserDatabase();

module.exports = app;
