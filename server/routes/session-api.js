
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

router.post('/login', (req, res) => {
  try {
    User.findOne({ 'userName': req.body.userName }, function (err, user) {
      if (err) {
        console.log(err);
        const signinMongodbErrorResponse = new ErrorResponse(500, 'Internal Server Error', err);
        res.status(500).send(signinMongodbErrorResponse.toObject());
      }
      else {
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
            console.log('Login successful');
            const signinResponse = new BaseResponse(200, 'Login successful', user.password, passwordIsValid);
            res.json(signinResponse.toObject());

          }
          /**
           * If password is invalid, return an error
           */
          else {
            console.log('Invalid password: Please try again');
            const invalidPasswordResponse = new BaseResponse(401, 'Invalid password', 'Please try again', null);
            res.status(401).send(invalidPasswordResponse.toObject());
          }
        }
        /**
         * if username is invalid, return an error
         */
        else {
          console.log('Invalid username: Please try again');
          const invalidUserNameResponse = new BaseResponse(401, 'Invalid username', 'Please try again', null);
          res.status(401).send(invalidUserNameResponse.toObject());
        }
      }
    })
  }
  catch (e) {
    console.log(e);
    const signinCatchErrorResponse = new ErrorResponse(500, 'Internal Server Error', e.message);
    res.status(500).send(signinCatchErrorResponse.toObject());
  }
});

module.exports = router;

