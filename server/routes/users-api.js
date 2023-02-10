/*
 Title: users-api.js
 Author: Patrick Wolff
 Contributors: April Yang, Andres Macias
 Date: 02/07/2023
 Description: Building security-questions APIs
 */

const express = require("express");
const User = require("../models/user");
// building reusable APIs
const ErrorResponse = require("../services/error-response");
const BaseResponse = require("../services/base-response");

// import reuseable error messages from config.json
const config = require("../data/config.json");

const router = express.Router();

// Find all users, findAllUsers

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - All users
 *     name: findAllUsers
 *     description: Reads,retrieves all users.
 *     summary: Returns all users.
 *     operationId: findAllUsers
 *     responses:
 *       '200':
 *         description: Returned all users
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/", async (req, res) => {
  // find all users, or return an error message
  try {
    User.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, users) {
        if (err) {
          console.log(err);
          const findAllMongoDBErrorResponse = new BaseResponse(
            501,
            `${config.mongoServerError}:${err.message}`,
            null
          );

          console.log(findAllMongoDBErrorResponse.toObject());
          res.status(501).send(findAllMongoDBErrorResponse.toObject());
        } else {
          const findAllResponse = new BaseResponse(
            200,
            `findAllUsers query was successful.`,
            users
          );
          console.log(findAllResponse.toObject());
          res.json(findAllResponse.toObject());
        }
      });
  } catch (e) {
    // internal Server Error
    const findAllErrorResponse = new ErrorResponse(
      500,
      `${config.serverError}:${err.message}`,
      null
    );
    console.log(findAllErrorResponse.toObject());
    res.status(500).send(findAllErrorResponse.toObject());
  }
});

module.exports = router;
