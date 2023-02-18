const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const router = express.Router();

const saltRounds = 10; // default salt rounds for hashing algorithm

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
          let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

          console.log(passwordIsValid);
          /**
           * if password is valid, return the user
           */
          if (passwordIsValid) {
            console.log("Login successful");
            const signinResponse = new BaseResponse(200, "Login successful", user);
            res.json(signinResponse.toObject());
          } else {
            /**
             * If password is invalid, return an error
             */
            console.log("Invalid password: Please try again");
            const invalidPasswordResponse = new BaseResponse(401, "Invalid password", "Please try again", user);
            res.status(401).send(invalidPasswordResponse.toObject());
          }
        } else {
          /**
           * if username is invalid, return an error
           */
          console.log(`Invalid username: ${req.body.userName}. Please try again`);
          const invalidUserNameResponse = new BaseResponse(401, "Invalid username", "Please try again", null);
          res.status(401).send(invalidUserNameResponse.toObject());
        }
      }
    });
  } catch (e) {
    console.log(e);
    const signinCatchErrorResponse = new ErrorResponse(500, "Internal Server Error", e.message);
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

// reset password
/**
@openapi
 * /api/session/users/{userName}/reset-password:
 *   post:
 *     tags:
 *       - Session
 *     description: API to update a user's password
 *     summary: updates the password for a user
 *     operationId: resetUserPassword
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         scheme:
 *           type: string
 *         description: username of the user who's password is being changed.
 *     requestBody:
 *       description: new value for the password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - password
 *             properties:
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

router.post("/users/:userName/reset-password", (req, res) => {
  try {
    console.log(req.body.password);
    const password = req.body.password;

    User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err) {
        console.log(err);
        const resetPasswordMongodbErrorResponse = new ErrorResponse("500", "Internal Server Error", err);
        res.status(500).send(resetPasswordMongodbErrorResponse.toObject());
      } else {
        console.log(user);

        let hashedPassword = bcrypt.hashSync(password, saltRounds);

        user.set({
          password: hashedPassword,
        });

        user.save(function (err, updatedUser) {
          if (err) {
            console.log(err);
            const updatedUserMongodbErrorResponse = new ErrorResponse("500", "Internal Server Error", err);
            res.status(500).send(updatedUserMongodbErrorResponse.toObject());
          } else {
            console.log(updatedUser);
            const updatedUserPasswordResponse = new BaseResponse("200", "Query successful", updatedUser);
            res.json(updatedUserPasswordResponse.toObject());
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
    const resetPasswordCatchErrorResponse = new ErrorResponse("500", "Internal Server Error", e.message);
    res.status(500).send(resetPasswordCatchErrorResponse.toObject());
  }
});

// register a new user
/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Session
 *     name: registerUser
 *     description: API to register a new user
 *     summary: registers a new user
 *     operationId: registerUser
 *     requestBody:
 *        description: User information
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                userName:
 *                  type: string
 *                password:
 *                  type: string
 *                firstName:
 *                  type: string
 *                lastName:
 *                  type: string
 *                phoneNumber:
 *                  type: string
 *                address:
 *                  type: string
 *                email:
 *                  type: string
 *                securityQuestions:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      questionText:
 *                        type: string
 *                      answerText:
 *                        type: string
 *     responses:
 *       '200':
 *         description: Query successful
 *       '500':
 *         description: Internal server error
 *       '501':
 *         description: MongoDB Exception
 */

router.post('/register', async (req, res) => {
  try {
    // check to see if the user already exists
    user.findOne({ username: req.body.username }, function (err, user) {
      if (err) {
        console.log(err);
        const registerUserMongodbErrorResponse = new ErrorResponse('500', 'Internal server error', err);
        res.status(500).send(registerUserMongodbErrorResponse.toObject());
      } else {
        // if the user does not exist, create a new user
        if (!user) {
          let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
          standardRole = {
            text: 'standard'
          }

          //user object
          let registeredUser = {
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            email: req.body.email,
            role: standardRole,
            selectedSecurityQuestions: req.body.selectedSecurityQuestions
          };

          //create a new user
          User.create(registeredUser, function (err, newUser) {
            if (err) {
              console.log(err);
              const newUserMongodbErrorResponse = new ErrorResponse('500', 'Internal server error', err);
              res.status(500).send(newUserMongodbErrorResponse.toObject());
            } else {
              console.log(newUser);
              const registeredUserResponse = new BaseResponse('200', 'Query successful', newUser);
              res.json(registeredUserResponse.toObject());
            }
          })
        } else {
          console.log(newUser);
          const alreadyExistsUserResponse = new BaseResponse('400', `The username: ${req.body.userName} is already in use.`, null);
          res.json(alreadyExistsUserResponse.toObject());
        }
      }
    });
  } catch (e) {
    console.log(e);
    const registerUserCatchErrorResponse = new ErrorResponse('500', 'Internal server error', e.message);
    res.status(500).send(registerUserCatchErrorResponse.toObject());
  }
});

module.exports = router;
