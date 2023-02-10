/*
 Title: users-api.js
 Author: Patrick Wolff
 Contributors: April Yang, Andres Macias
 Date: 02/07/2023
 Description: Building User APIs
 */

const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");

// import reuseable error messages from config.json
const config = require("../data/config.json");

const router = express.Router();
const saltRounds = 10; // default salt rounds for hashing algorithm

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
 *     parameters:
 *       - name: users
 *         in: path
 *         required: true
 *         description: Reads,retrieves all users.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returned all users
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/", async (req, res) => {
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

// Create User

router.post("/", async (req, res) => {
  try {
    let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds); // salt/hash the password

    standardRole = {
      text: "standard",
    };

    // user object
    let newUser = {
      userName: req.body.userName,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      email: req.body.email,
      role: standardRole,
    };

    User.create(newUser, function (err, user) {
      if (err) {
        console.log(err);
        const createUserMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        res.status(500).send(createUserMongodbErrorResponse.toObject());
      } else {
        console.log(user);
        const CreateUserResponse = new BaseResponse(
          200,
          "Query successful",
          user
        );
        res.json(CreateUserResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const createUserCatchErrorResponse = ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(createUserCatchErrorResponse.toObject());
  }
});

module.exports = router;
