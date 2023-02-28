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
/**
@openapi
 * /api/invoices/{userName}:
 *   post:
 *     tags:
 *       - Invoices
 *     description: API to create a new invoice
 *     summary: Creates a new invoice
 *     operationId: createInvoice
 *     parameters:
 *      - name: userName
 *        in: path
 *        description: userName of the user who created the invoice
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *              lineItems:
 *                type: object
 *                properties:
 *                   title:
 *                     type: string
 *                   price:
 *                     type: number
 *              price:
 *                type: number
 *              partsAmount:
 *                type: number
 *              priceAmount:
 *                type: number
 *              laborAmount:
 *                type: number
 *              lineItemTotal:
 *                type: number
 *              total:
 *                type: number
 *
 *
 *     responses:
 *       '200':
 *         description: Query successful
 *       '500':
 *         description: Internal server error
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/:userName", async (req, res) => {
  try {
    const newInvoice = {
      userName: req.params.userName,
      lineItems: req.body.lineItems,
      partsAmount: req.body.partsAmount,
      priceAmount: req.body.priceAmount,
      laborAmount: req.body.laborAmount,
      lineItemTotal: req.body.lineItemTotal,
      total: req.body.total,
    };

    console.log(newInvoice);
    Invoice.create(newInvoice, function (err, invoice) {
      if (err) {
        console.log(err);
        const createInvoiceMongodbErrorResponse = new ErrorResponse(
          "500",
          "Internal Server Error",
          err
        );
        res.status(500).send(createInvoiceMongodbErrorResponse.toObject());
      } else {
        console.log(invoice);
        const createInvoiceMongodbSuccessResponse = new BaseResponse(
          "200",
          "Query successful",
          invoice
        );
        res.json(createInvoiceMongodbSuccessResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const createInvoiceCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      e.message
    );
    res.status(500).send(createInvoiceCatchErrorResponse.toObject());
  }
});

// findPurchasesByService
/**
 * @openapi
 * /api/invoices/purchases-graph:
 *   get:
 *     tags:
 *       - Invoices
 *     name: findPurchasesByService
 *     description: Reads,retrieves all purchases by service.
 *     summary: Returns all purchases by service.
 *     operationId: findPurchasesByService
 *     responses:
 *       '200':
 *         description: Query successful
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
 */
router.get("/purchases-graph", async (req, res) => {
  try {
    Invoice.aggregate(
      [
        {
          $unwind: "$lineItems",
        },
        {
          $group: {
            _id: {
              title: "$lineItems.title",
              price: "$lineItems.price",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.title": 1,
          },
        },
      ],
      function (err, purchasesGraph) {
        if (err) {
          console.log(err);
          const FindPurchasesByServiceGraphMongodbErrorResponse =
            new ErrorResponse("500", "Internal server error", err);
          res
            .status(500)
            .send(FindPurchasesByServiceGraphMongodbErrorResponse.toObject());
        } else {
          console.log(purchasesGraph);
          const FindPurchasesByServiceGraphResponse = new BaseResponse(
            "200",
            "Query successful",
            purchasesGraph
          );
          res.json(FindPurchasesByServiceGraphResponse.toObject());
        }
      }
    );
  } catch (e) {
    console.log(e);
    const FindPurchasesByServiceCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(FindPurchasesByServiceCatchErrorResponse.toObject());
  }
});

module.exports = router;
