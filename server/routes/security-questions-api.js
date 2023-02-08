/*
 Title: security-questions-api.js
 Author: April Yang
 Contributors: Patrick Wolff, Andres Macias
 Date: 02/07/2023
 Description: Building security-questions APIs
 */

const express = require("express");
const SecurityQuestion = require("../models/security-question");
// import reuseable error messages from config.json
const config = require("../data/config.json");

const router = express.Router();

// Find an security question by ID , findSecurityQuestionById
/**
 * @openapi
 */
router.get("/:id", async (req, res) => {
  try {
    // find a security question by _id, or return an error message
    SecurityQuestion.findOne(
      { _id: req.params._id },
      function (err, securityQuestion) {
        // if there is a mongodb error, handle it and return a 501 error message
        if (err) {
          console.log(err);
          res.status(501).send({
            err: config.mongoServerError + ": " + err.message,
          });
        } else {
          console.log(securityQuestion);
          res.json(securityQuestion); // returns the data as JSON
        }
      }
    );
  } catch (e) {
    // internal Server Error
    console.log(e);
    res.status(500).send({
      err: config.serverError + ": " + e.message,
    });
  }
});

module.exports = router;
