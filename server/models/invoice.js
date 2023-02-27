/*
Title: invoice.js
Author: Professor Krasso
Date: 02/23/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: Creates the model of invoice schema with mongoose
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// import line item schema
const lineItemDocument = require("../schemas/line-item");

// create a model of invoiceSchema
const invoiceSchema = new Schema({
  userName: { type: String },
  lineItems: [lineItemDocument],
  partsAmount: { type: Number },
  laborAmount: { type: Number },
  lineItemTotal: { type: Number },
  total: { type: Number },
  orderDate: { type: Date, default: new Date() },
});

// export invoiceSchema
module.exports = mongoose.model("Invoice", invoiceSchema);
