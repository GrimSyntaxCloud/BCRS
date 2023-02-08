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
 * /api/security-questions/{id}:
 *   get:
 *     tags:
 *       - Security Questions
 *     name: findSecurityQuestionById
 *     description: Reads,retrieves a security question by id.
 *     summary: Returns a security question by id.
 *     operationId: findSecurityQuestionById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id to filter the securityQuestions collection by.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returned an security question with corresponding Id
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:id", async (req, res) => {
  try {
    // find a security question by _id, or return an error message
    SecurityQuestion.findOne(
      { _id: req.params.id },
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
