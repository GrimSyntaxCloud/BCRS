/*
 Title:role-api-api.js
 Author: Professor Krasso
 Date: 02/23/2023
 Modified By: Andres Macias/Patrick Wolff/April Yang
 Description: invoice APIs
 */

const express = require("express");
const router = express.Router();
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const Invoice = require("../models/invoice");

/**
 * createInvoice
 * localhost:3000/api/invoices
 */
router.post("/", async (req, res) => {
  try {
    const newInvoice = {
      userName: req.params.userName,
      lineItems: req.body.lineItems,
      partsAmount: req.body.partsAmount,
      priceAmount: req.body.priceAmount,
      laborAmount: req.body.laborAmount,
      lineItemTotal: req.body.lineItemTotal,
      total: req.body.total
    };

    console.log(newInvoice);
    Invoice.create(newInvoice, function (err, invoice) {
      if (err) {
        console.log(err);
        const createInvoiceMongodbErrorResponse = new ErrorResponse("500", "Internal Server Error", err);
        res.status(500).send(createInvoiceMongodbErrorResponse.toObject());
      } else {
        console.log(invoice);
        const createInvoiceMongodbSuccessResponse = new BaseResponse("200", "Query successful", invoice);
        res.json(createInvoiceMongodbSuccessResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const createInvoiceCatchErrorResponse = new ErrorResponse("500", "Internal Server Error", e.message);
    res.status(500).send(createInvoiceCatchErrorResponse.toObject());
  }
});

module.exports = router;
