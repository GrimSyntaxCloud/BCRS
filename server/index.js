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
const UserAPI = require("./routes/users-api");
const SessionAPI = require("./routes/session-api");
const RolesAPI = require("./routes/role-api");
const InvoiceAPI = require("./routes/invoice-api");

// import MongoDB database connection string from config.json
const config = require("./data/config.json");
// Express variable.
const app = express();

// import swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/bcrs")));
app.use("/", express.static(path.join(__dirname, "../dist/bcrs")));

// default server port value.
const PORT = process.env.PORT || 3000;

// Bob computer repair shop database connection
const CONN = config.dbConn;

/**
 * fixed Mongoose DeprecationWarning:
 * Switched `strictQuery` back to `false` by default in Mongoose 7.
 */
mongoose.set("strictQuery", false);

/**
 * APIs go here
 */

/* define an variable object named options for configuring swagger UI */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WEB450 Bob's Computer Repair Shop",
      version: "1.0.0",
    },
  },
  // files containing annotations for the OpenAPI Specification
  apis: [
    "./server/routes/security-questions-api.js",
    "./server/routes/users-api.js",
    "./server/routes/session-api.js",
    "./server/routes/role-api.js",
    "./server/routes/invoice-api.js",
  ],
};

/* call the swaggerJsdoc library using the options object literal. */
const openapiSpecification = swaggerJsdoc(options);
/* wire the openapiSpecification variable to the app variable. Configure express to use /api-docs route to serve swaggerJsdoc  */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification)); // http://localhost:3000/api-docs

app.use("/api/security-questions", SecurityQuestionsAPI);
app.use("/api/users", UserAPI);
app.use("/api/session", SessionAPI);
app.use("/api/roles", RolesAPI);
app.use("/api/invoices", InvoiceAPI);
/**
 * Database connection.
 */

mongoose.connect(CONN).then(
  () => {
    console.log("Connection to the database was successful");
  },
  (err) => {
    console.log("MongoDB Error: " + err.message);
  }
);

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
