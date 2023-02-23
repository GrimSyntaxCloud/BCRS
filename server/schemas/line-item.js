/*
Title: line-item.js
Author: Professor Krasso
Date: 02/23/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Creating selected line-item schema with mongoose
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create line item schema to use with mongoose
const lineItemSchema = new Schema({
  title: { type: String },
  price: { type: Number },
});

// exports the lineItemSchema
module.exports = lineItemSchema;
