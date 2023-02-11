
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const router = express.Router();


/**
 * User sign in
 */

router.post('/login', (req, res) => {
  try {
    User.findOne({'userName': req.body.userName }, function (err, user) {
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
          let passwordIsValid = bcrypt.compare(req.body.password, user.password);

          /**
           * if password is valid, return the user
           */
          if (passwordIsValid) {
            console.log('Login successful');
            const signinResponse = new BaseResponse(200, 'Login successful', user);
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
      else
      {
        console.log('Invalid username: Please try again');
        const invalidUserNameResponse = new BaseResponse(401, 'Invalid username', 'Please try again', null);
        res.status(401).send(invalidUserNameResponse.toObject());
      }
    }
    })
  }
  catch (e)
  {
    console.log(e);
    const signinCatchErrorResponse = new ErrorResponse(500, 'Internal Server Error', e.message);
    res.status(500).send(signinCatchErrorResponse.toObject());
  }
});

module.exports = router;

