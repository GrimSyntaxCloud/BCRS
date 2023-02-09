/*
 Title: users-api.js
 Author: Patrick Wolff
 Contributors: April Yang, Andres Macias
 Date: 02/07/2023
 Description: Building security-questions APIs
 */

const express = require("express");
const User = require("../models/user");

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
    // find all users, or return an error message
    User.find({}, function (err, users) {
      if (err) {
        console.log(err);
        // if there is a mongodb error, handle it and return a 501 error message
        res.status(501).send({
          err: config.mongoServerError + ": " + err.message,
        });
      } else {
        console.log(users);
        res.json(users);
      }
    });
  } catch (e) {
    console.log(e);
    // internal Server Error
    res.status(500).send({
      err: config.serverError + ": " + err.message,
    });
  }
});

module.exports = router;
