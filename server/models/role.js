/*
Title: role.js
Author: Professor Krasso
Date: 02/07/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Creates the model of role schema with mongoose
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a model of roleSchema
const roleSchema = new Schema(
  {
    text: { type: String, unique: true },
    // data will not be hard deleted in mongoDB
    isDisabled: { type: Boolean, default: false },
  },
  { collection: "roles" } // pre-build collection in mongodb atlas
);

// export roleSchema
module.exports = mongoose.model("Role", roleSchema);
