/*
Title: selectedSecurityQuestion.js
Author: Professor Krasso
Date: 02/07/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Creating role schema with mongoose
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create selected security question Schema to use with mongoose
const selectedSecurityQuestionSchema = new Schema({
  questionText: { type: String },
  answerText: { type: String },
});

// export selectedSecurityQuestionSchema
module.exports = selectedSecurityQuestionSchema;
