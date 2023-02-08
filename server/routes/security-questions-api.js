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

// Find all security questions for account registration form: Security Questions page
// findAllSecurityQuestions
/**
 * @openapi
 * /api/security-questions/list-questions:
 *   get:
 *     tags:
 *       - A list of security questions
 *     name: findAllSecurityQuestions
 *     description: Reads,retrieves a list of all security questions.
 *     summary: Returns a list of all security questions.
 *     operationId: findAllSecurityQuestions
 *     parameters:
 *       - name: list-questions
 *         in: path
 *         required: true
 *         description: Reads,retrieves a list of all security questions.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returned a list of all security questions
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/list-questions", async (req, res) => {
  // find all security questions, or return an error message
  try {
    SecurityQuestion.find({}, function (err, securityQuestions) {
      if (err) {
        console.log(err);
        // if there is a mongodb error, handle it and return a 501 error message
        res.status(501).send({
          err: config.mongoServerError + ": " + err.message,
        });
      } else {
        console.log(securityQuestions);
        res.json(securityQuestions);
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

// Delete a security question by ID, deleteSecurityQuestionById;
/**
 * @openapi
 * /api/security-questions/{id}:
 *   delete:
 *     tags:
 *       - Security Questions
 *     description: Reads,retrieves a security question by id and deletes it.
 *     summary: deletes a security question by id
 *     operationId: deleteSecurityQuestionById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         scheme:
 *           type: string
 *     responses:
 *       '200':
 *         description: A security question gets deleted
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete("/:id", async (req, res) => {
  // find a security question by _id and delete it, or return an error message
  try {
    SecurityQuestion.findByIdAndDelete(
      { _id: req.params.id },
      function (err, securityQuestion) {
        if (err) {
          console.log(err);
          // if there is a mongodb error, handle it and return a 501 error message
          res.status(501).send({
            err: config.mongoServerError + ": " + err.message,
          });
        } else {
          console.log(securityQuestion);
          res.json(securityQuestion);
        }
      }
    );
  } catch (e) {
    console.log(e);
    // internal Server Error
    res.status(500).send({
      err: config.serverError + ": " + err.message,
    });
  }
});

module.exports = router;
