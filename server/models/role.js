/*
Title: role.js
Author: Professor Krasso
Date: 02/23/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Creates the model of role schema with mongoose
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a model of roleSchema
const roleSchema = new Schema({
  text: { type: String, unique: true },
  isDisabled: { type: Boolean, default: false },
});

// export roleSchema
module.exports = mongoose.model("Role", roleSchema);
