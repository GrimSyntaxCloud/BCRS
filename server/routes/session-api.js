const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const router = express.Router();

// find user by username and verify password to login
/**
@openapi
 * /api/session/login:
 *   post:
 *     tags:
 *       - Session
 *     description: API to login a user
 *     summary: looks for a user in the database and validates the password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *             properties:
 *              userName:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *       '200':
 *         description: Query successful
 *       '500':
 *         description: Internal server error
 *       '501':
 *         description: MongoDB Exception
 */

/**
 * User sign in
 */

router.post("/login", (req, res) => {
  try {
    User.findOne({ userName: req.body.userName }, function (err, user) {
      if (err) {
        console.log(err);
        const signinMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal Server Error",
          err
        );
        res.status(500).send(signinMongodbErrorResponse.toObject());
      } else {
        console.log(user);
        /**
         * Description: If the user is found, compare the password
         */
        if (user) {
          let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );

          console.log(passwordIsValid);
          /**
           * if password is valid, return the user
           */
          if (passwordIsValid) {
            console.log("Login successful");
            const signinResponse = new BaseResponse(
              200,
              "Login successful",
              user
            );
            res.json(signinResponse.toObject());
          } else {
            /**
             * If password is invalid, return an error
             */
            console.log("Invalid password: Please try again");
            const invalidPasswordResponse = new BaseResponse(
              401,
              "Invalid password",
              "Please try again",
              null
            );
            res.status(401).send(invalidPasswordResponse.toObject());
          }
        } else {
          /**
           * if username is invalid, return an error
           */
          console.log("Invalid username: Please try again");
          const invalidUserNameResponse = new BaseResponse(
            401,
            "Invalid username",
            "Please try again",
            null
          );
          res.status(401).send(invalidUserNameResponse.toObject());
        }
      }
    });
  } catch (e) {
    console.log(e);
    const signinCatchErrorResponse = new ErrorResponse(
      500,
      "Internal Server Error",
      e.message
    );
    res.status(500).send(signinCatchErrorResponse.toObject());
  }
});

// verifyUser
/**
 * @openapi
 * /api/session/verify/users/{userName}:
 *   get:
 *     tags:
 *       - Session
 *     description: API will verify if a username is valid
 *     summary: verify username against what is in db
 *     parameters:
 *       - in: path
 *         name: userName
 *         schema:
 *           type: string
 *           description: userName to search
 *     responses:
 *       '200':
 *         description: Query successful
 *       '400':
 *         description: Invalid username
 *       '500':
 *         description: Internal server error
 */
router.get("/verify/users/:userName", async (req, res) => {
  try {
    User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err) {
        console.log(err);
        const verifyUserMongodbErrorResponse = new ErrorResponse(
          "500",
          "Internal server error",
          err
        );
        res.status(500).send(verifyUserMongodbErrorResponse.toObject());
      } else {
        if (user) {
          console.log(user);
          const verifyUserResponse = new BaseResponse(
            "200",
            "Query successful",
            user
          );
          res.json(verifyUserResponse.toObject());
        } else {
          const invalidUserNameResponse = new BaseResponse(
            "400",
            "Invalid username",
            req.params.userName
          );
          res.status(400).send(invalidUserNameResponse.toObject());
        }
      }
    });
  } catch (e) {
    console.log(e);
    const verifyUserCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(verifyUserCatchErrorResponse.toObject());
  }
});

// verify security questions when user select security questions in the form
// verifySecurityQuestions
/**
 * @openapi
 * /api/session/verify/users/{username}/security-questions:
 *   post:
 *     tags:
 *       - Session
 *     name: verifySecurityQuestions
 *     description: API for comparing the users entered security question answers against what's saved in the users document.
 *     summary: Verify a user's security questions
 *     operationId: verifySecurityQuestions
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         description: find a userName first.
 *         scheme:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: User's security questions with answers' information are saved in the users document
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionText1
 *               - questionText2
 *               - questionText3
 *               - answerText1
 *               - answerText2
 *               - answerText3
 *             properties:
 *               questionText1:
 *                 type: string
 *               questionText2:
 *                 type: string
 *               questionText3:
 *                 type: string
 *               answerText1:
 *                 type: string
 *               answerText2:
 *                 type: string
 *               answerText3:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Verified security question
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/verify/users/:userName/security-questions", async (req, res) => {
  try {
    // find a userName for verifying user's security questions were saved in the database,  or return an error message
    User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err) {
        console.log(err);
        const verifySecurityQuestionsMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        res
          .status(500)
          .send(verifySecurityQuestionsMongodbErrorResponse.toObject());
      } else {
        console.log(user);
        // user's selected security questions must match the information was saved in the database
        const selectedSecurityQuestionOne = user.selectedSecurityQuestions.find(
          (q) => q.questionText === req.body.questionText1
        );
        const selectedSecurityQuestionTwo = user.selectedSecurityQuestions.find(
          (q2) => q2.questionText === req.body.questionText2
        );
        const selectedSecurityQuestionThree =
          user.selectedSecurityQuestions.find(
            (q3) => q3.questionText === req.body.questionText3
          );

        const isValidAnswerOne =
          selectedSecurityQuestionOne.answerText === req.body.answerText1;
        const isValidAnswerTwo =
          selectedSecurityQuestionTwo.answerText === req.body.answerText2;
        const isValidAnswerThree =
          selectedSecurityQuestionThree.answerText === req.body.answerText3;

        // if user's answer is valid to match the answer was saved in the database, then return success and display a message
        if (isValidAnswerOne && isValidAnswerTwo && isValidAnswerThree) {
          console.log(
            `User ${user.userName} answered their security questions correctly`
          );
          const validSecurityQuestionsResponse = new BaseResponse(
            "200",
            "success",
            user
          );
          res.json(validSecurityQuestionsResponse.toObject());
        } else {
          // if user's answer is invalid to match the answer was saved in the database, then return error and display a message
          console.log(
            `User ${user.userName} did not answer their security questions correctly`
          );
          const invalidSecurityQuestionsResponse = new BaseResponse(
            "200",
            "error",
            user
          );
          res.json(invalidSecurityQuestionsResponse.toObject());
        }
      }
    });
  } catch (e) {
    console.log(e);
    // Internal Server Error
    const verifySecurityQuestionsCatchErrorResponse = new ErrorResponse(
      500,
      "Internal Server Error",
      e.message
    );
    res.status(500).send(verifySecurityQuestionsCatchErrorResponse.toObject());
  }
});

module.exports = router;
