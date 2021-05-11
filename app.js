const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
require("./helpers/passport");

mongoose
  .connect(process.env.DB_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB database connection established successfully!`);
  })
  .catch((err) => console.error("Could not connect to database!", err));

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(passport.initialize());
app.use("/api", indexRouter);

// const fake = require("./fakeData");
// fake.createUserDatabase();

module.exports = app;
