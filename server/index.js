/*
Title: index.js
Author: Professor Krasso
Date: 02/07/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: App Server File
*/

/**
 * Require statements
 */
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const SecurityQuestionsAPI = require("./routes/security-questions-api");

// import MongoDB database connection string from config.json
const config = require("./data/config.json");

const app = express(); // Express variable.

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/bcrs")));
app.use("/", express.static(path.join(__dirname, "../dist/bcrs")));

// default server port value.
const PORT = process.env.PORT || 3000;

// TODO: This line will be replaced with your database connection string (including username/password).
// const CONN = 'REMOVED_EXPOSED_CREDENTIAL';

// Bob computer repair shop database connection
const CONN = config.dbConn;

/**
 * fixed Mongoose DeprecationWarning:
 * Switched `strictQuery` back to `false` by default in Mongoose 7.
 */
mongoose.set("strictQuery", false);

/**
 * APIs
 */
app.use("/api/security-questions", SecurityQuestionsAPI);

/**
 * Database connection.
 */
mongoose
  .connect(CONN)
  .then(() => {
    console.log("Connection to the database was successful");
  })
  .catch((err) => {
    console.log("MongoDB Error: " + err.message);
  });

mongoose.connection.on("error", (err) => {
  console.log(config.mongoServerError + ": " + err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Server disconnected from host (MongoDB Atlas).");
});

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log("Application started and listening on PORT: " + PORT);
});
