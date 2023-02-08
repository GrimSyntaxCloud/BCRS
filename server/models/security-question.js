/*
Title: security-questions.js
Author: Professor Krasso
Date: 02/07/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Creates the model of security questions schema with mongoose
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a model of securityQuestionSchema
const securityQuestionSchema = new Schema(
  {
    text: { type: String },
    // data will not be hard deleted in mongoDB
    isDisabled: { type: Boolean, default: false },
  },
  { collection: "securityQuestions" } // pre-build collection in mongodb atlas
);

// export securityQuestionSchema
module.exports = mongoose.model("SecurityQuestion", securityQuestionSchema);
