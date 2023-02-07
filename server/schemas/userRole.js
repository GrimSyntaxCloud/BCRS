/*
Title: userRole.js
Author: Professor Krasso
Date: 02/07/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Creating role schema with mongoose
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create the model of roleSchema to use with mongoose
const userRoleSchema = new Schema({
  text: { type: String, default: "standard" },
});

// export roleSchema
module.exports = userRoleSchema;
