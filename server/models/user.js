/*
Title: user.js
Author: Professor Krasso
Date: 02/08/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Creates the model of user schema with mongoose
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userRoleSchema = require("../schemas/userRole");
const selectedSecurityQuestionSchema = require("../schemas/selectedSecurityQuestion");

// create a model of userSchema
const userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    email: { type: String },
    isDisabled: { type: Boolean, default: false }, // data will not be hard deleted in mongoDB
    role: userRoleSchema,
    securityQuestions: [selectedSecurityQuestionSchema],
    dateCreated: { type: Date, default: new Date() },
    dateModified: { type: Date },
  },
  { collection: "users" } // pre-build collection in mongodb atlas
);

// exports user model
module.exports = mongoose.model("User", userSchema);
