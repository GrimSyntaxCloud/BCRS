/*
 Title: security-questions-api.js
 Author: Professor Krasso
 Date: 02/07/2023
 Modified By: Andres Macias/Patrick Wolff/April Yang
 Description: Building security-questions APIs
 */

const express = require("express");
const SecurityQuestion = require("../models/security-question");
// building reusable APIs
const ErrorResponse = require("../services/error-response");
const BaseResponse = require("../services/base-response");
// import reuseable error messages from config.json
const config = require("../data/config.json");

const router = express.Router();

// Find all security questions for the account registration form: Security Questions page
// findAllSecurityQuestions

/**
 * @openapi
 * /api/security-questions:
 *   get:
 *     tags:
 *       - A list of security questions
 *     name: findAllSecurityQuestions
 *     description: Reads,retrieves a list of all security questions.
 *     summary: Returns a list of all security questions.
 *     operationId: findAllSecurityQuestions
 *     responses:
 *       '200':
 *         description: Returned a list of all security questions
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/", async (req, res) => {
  // finds all security questions if isDisabled property is set to false, or return an error message
  try {
    SecurityQuestion.find({})

      .where("isDisabled")
      .equals(false)
      .exec(function (err, securityQuestions) {
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
            `findAllSecurityQuestions query was successful.`,
            securityQuestions
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
        if (err) {
          console.log(err);
          const findByIdMongoDBErrorResponse = new BaseResponse(
            501,
            `${config.mongoServerError}:${err.message}`,
            null
          );

          console.log(findByIdMongoDBErrorResponse.toObject());
          res.status(501).send(findByIdMongoDBErrorResponse.toObject());
        } else {
          const findByIdResponse = new BaseResponse(
            200,
            `findSecurityQuestionById query was successful.`,
            securityQuestion
          );
          console.log(findByIdResponse.toObject());
          res.json(findByIdResponse.toObject());
        }
      }
    );
  } catch (e) {
    // internal Server Error
    const findByIdErrorResponse = new ErrorResponse(
      500,
      `${config.serverError}:${err.message}`,
      null
    );
    console.log(findByIdErrorResponse.toObject());
    res.status(500).send(findByIdErrorResponse.toObject());
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
    SecurityQuestion.findOne(
      { _id: req.params.id },
      function (err, securityQuestion) {
        if (err) {
          console.log(err);
          const deleteByIdMongoDBErrorResponse = new BaseResponse(
            501,
            `${config.mongoServerError}:${err.message}`,
            null
          );

          console.log(deleteByIdMongoDBErrorResponse.toObject());
          res.status(501).send(deleteByIdMongoDBErrorResponse.toObject());
        } else {
          securityQuestion.set({
            isDisabled: true,
          });

          securityQuestion.save(function (err, savedSecurityQuestion) {
            if (err) {
              console.log(err);
              const savedSecurityQuestionMongoDBErrorResponse =
                new BaseResponse(
                  501,
                  `${config.mongoServerError}:${err.message}`,
                  null
                );

              console.log(savedSecurityQuestionMongoDBErrorResponse.toObject());
              res
                .status(501)
                .send(savedSecurityQuestionMongoDBErrorResponse.toObject());
            } else {
              // console.log(savedSecurityQuestion);

              const deleteByIdResponse = new BaseResponse(
                200,
                `deleteSecurityQuestionById query was successful.`,
                savedSecurityQuestion
              );
              res.json(deleteByIdResponse.toObject());
            }
          });
        }
      }
    );
  } catch (e) {
    // internal Server Error
    const deleteByIdErrorResponse = new ErrorResponse(
      500,
      `${config.serverError}:${err.message}`,
      null
    );
    console.log(deleteByIdErrorResponse.toObject());
    res.status(500).send(deleteByIdErrorResponse.toObject());
  }
});

module.exports = router;
