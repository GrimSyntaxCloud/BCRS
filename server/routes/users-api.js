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
 *       - Users
 *     name: findAllUsers
 *     description: Reads,retrieves all users.
 *     summary: Returns all users.
 *     operationId: findAllUsers
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
/**
@openapi
 * /api/user:
 *   post:
 *     tags:
 *       - Users
 *     description: API to create new user objects
 *     summary: Creates a new user object
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


// Find User by Id
/**
 * @openapi
 * /api/user/{id}:
 *  post:
 *      tags:
 *          - Users
 *      description: finds user by Id
 *      summary: retrieves a user from the database
 *      parameters:
 *          - in: path
 *            name: id
 *            description: the id of the employee to update
 *            required: yes
 *            schema:
 *              type: number
 *      response:
 *          '200':
 *              description: Document updated
 *          '500':
 *              description: Server Exception
 *          '501':
 *              description: MongoDB Exception
 */

router.get('/:id', async (req, res) => {
  try {
    User.findOne({'_id': req.params.id}, function(err, user) {
      if (err) {
        console.log(err);
        const findByIdMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
        res.status(500).send(findByIdMongodbErrorResponse.toObject());
      } else {
        console.log(user);
      }
    })
  } catch(e){
    console.log(e);
    const findByIdCatchErrorResponse = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(findByIdCatchErrorResponse.toObject());
  }
});

// Update user by Id
/**
 * @openapi
 * /api/user/{id}:
 *  put:
 *      tags:
 *          - Users
 *      description: finds user by Id
 *      summary: retrieves a user from the database
 *      parameters:
 *          - in: path
 *            name: id
 *            description: the id of the employee to update
 *            required: yes
 *            schema:
 *              type: number
 *      response:
 *          '200':
 *              description: Document updated
 *          '500':
 *              description: Server Exception
 *          '501':
 *              description: MongoDB Exception
 */

router.put('/:id', async (req, res) => {
  try {
    User.findOne({'_id': req.params.id}, function(err, user) {
      if (err) {
        console.log(err);
        const updateUserMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
        res.status(500).send(updateUserMongodbErrorResponse.toObject());
      } else {
        console.log(user);

        user.set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          email: req.body.email,
          dateModified: new Date()
        })

        user.save(function(err, savedUser) {
          if (err) {
            console.log(err);
            const saveUserMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
            res.status(500).send(saveUserMongodbErrorResponse.toObject());
          } else {
            console.log(savedUser);
            const saveUserResponse = new BaseResponse(200, 'Query successful', savedUser);
            res.json(saveUserResponse.toObject());
          }
        })
      }
    })
  } catch(e){
    console.log(e);
    const updateUserCatchErrorResponse = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(updateUserCatchErrorResponse.toObject());
  }
});

// Delete User
/**
 * @openapi
 * /api/user/{id}:
 *  post:
 *      tags:
 *          - Users
 *      description: Deletes a user
 *      summary: Delete a user from the database
 *      parameters:
 *          - in: path
 *            name: id
 *            description: the id of the employee to update
 *            required: yes
 *            schema:
 *              type: number
 *      response:
 *          '200':
 *              description: Document updated
 *          '500':
 *              description: Server Exception
 *          '501':
 *              description: MongoDB Exception
 */

router.delete('/:id', async (req, res) => {
  try {
    User.findOne({'_id': req.params.id}, function(err, user) {
      if (err) {
        console.log(err);
        const deleteUserMongodbErrorResponse = new ErrorResponse(500, 'Internal sever error', err);
        res.status(500).send(deleteUserMongodbErrorResponse.toObject());
      } else {
        console.log(user);

        user.set({
          isDisabled: true,
          dateModified: new Date()
        });

        user.save(function(err, savedUser) {
          if (err) {
            console.log(err);
            const savedUserMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
            res.json(savedUserMongodbErrorResponse.toObject());
          } else {
            console.log(savedUser);
            const savedUserResponse = new BaseResponse(200, 'Query successful', savedUser);
            res.json(savedUserResponse.toObject());
          }
        })
      }
    })
  } catch(e){
    console.log(e);
    const deleteUserCatchErrorResponse = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(deleteUserCatchErrorResponse.toObject());
  }
});

module.exports = router;
