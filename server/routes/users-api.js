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

/**
 * API: http://localhost:3000/api/users
 * findAllUsers
 */
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
          const findAllUsersMongodbErrorResponse = new BaseResponse(501, `${config.mongoServerError}:${err.message}`, null);
          console.log(findAllUsersMongodbErrorResponse.toObject());
          res.status(500).send(findAllUsersMongodbErrorResponse.toObject());
        } else {
          const findAllUsersResponse = new BaseResponse(
            200, `findAllUsers query was successful.`, users);
          console.log(findAllUsersResponse.toObject());
          res.json(findAllUsersResponse.toObject());
        }
      });
  } catch (e) {
    // internal Server Error
    const findAllUsersCatchErrorResponse = new ErrorResponse(500, `${config.serverError}:${err.message}`, null);
    console.log(findAllUsersCatchErrorResponse.toObject());
    res.status(500).send(findAllUsersCatchErrorResponse.toObject());
  }
});

/**
 * API: http://localhost:3000/api/user
 * createUser
 */
/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     name: createUser
 *     description: API to create new user
 *     summary: Creates a new user object
 *     operationId: createUser
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
        const createUserMongodbErrorResponse = new ErrorResponse(500, "Internal server error", err);
        res.status(500).send(createUserMongodbErrorResponse.toObject());
      } else {
        console.log(user);
        const CreateUserResponse = new BaseResponse(200, "Query successful", user);
        res.json(CreateUserResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const createUserCatchErrorResponse = ErrorResponse(500, "Internal server error", e.message
    );
    res.status(500).send(createUserCatchErrorResponse.toObject());
  }
});

/**
 * API: http://localhost:3000/api/users/{id}
 * findUserById
 */
/**
 * @openapi
 *  /api/users/{id}:
 *    get:
 *      tags:
 *        - Users
 *      name: findUserById
 *      description: finds user by Id
 *      summary: retrieves a user from the database
 *      operationId: findUserById
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: find the user by id
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: user found
 *        '500':
 *          description: Server Exception
 *        '501':
 *          description: MongoDB Exception
 */

router.get("/:id", async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        console.log(err);
        const findUserByIdMongodbErrorResponse = new BaseResponse(
          500,
          `${config.mongoServerError}:${err.message}`,
          null
        );
        console.log(findUserByIdMongodbErrorResponse.toObject());
        res.status(500).send(findUserByIdMongodbErrorResponse.toObject());
      } else {
        const findUserByIdResponse = new BaseResponse(
          200,
          `findUserById query was successful.`,
          user
        );
        res.json(findUserByIdResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const findByIdCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e
    );
    res.status(500).send(findByIdCatchErrorResponse.toObject());
  }
});

// Add api for findUserByUsername
router.get('/users/:userName', async(req, res) =>  {
  /** try {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        console.log(err);
        const findUserByIdMongodbErrorResponse = new BaseResponse(
          500,
          `${config.mongoServerError}:${err.message}`,
          null
        );
        console.log(findUserByIdMongodbErrorResponse.toObject());
        res.status(500).send(findUserByIdMongodbErrorResponse.toObject());
      } else {
        const findUserByIdResponse = new BaseResponse(
          200,
          `findUserByUserName query was successful.`,
          user
        );
        res.json(findUserByIdResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const findByIdCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e
    );
    res.status(500).send(findByIdCatchErrorResponse.toObject());
  } */
})

/**
 * API: http://localhost:3000/api/users/{id}
 * updateUserById
 */
/**
 * @openapi
 * /api/users/{id}:
 *  put:
 *      tags:
 *          - Users
 *      description: updates a user by Id
 *      summary: updates a user from the database
 *      parameters:
 *          - name: id
 *            in: path
 *            description: the id of the employee to update
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          description: Updates the user information
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  password:
 *                    type: string
 *                  firstName:
 *                    type: string
 *                  lastName:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 *                  email:
 *                   type: string
 *                  address:
 *                    type: string
 *      responses:
 *          '200':
 *              description: Document updated
 *          '500':
 *              description: Server Exception
 *          '501':
 *              description: MongoDB Exception
 */

router.put("/:id", async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        console.log(err);
        const updateUserByIdMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        res.status(500).send(updateUserByIdMongodbErrorResponse.toObject());
      } else {
        console.log(user);

        let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds); // salt/hash the password


        user.set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hashedPassword,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          email: req.body.email,
          dateModified: new Date(),
        });

        user.save(function (err, savedUser) {
          if (err) {
            console.log(err);
            const saveUserMongodbErrorResponse = new ErrorResponse(500, "Internal server error", err);
            res.status(500).send(saveUserMongodbErrorResponse.toObject());
          } else {
            console.log(savedUser);
            const saveUserResponse = new BaseResponse(200, "Query successful", savedUser);
            res.json(saveUserResponse.toObject());
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
    const updateUserByIdCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(updateUserByIdCatchErrorResponse.toObject());
  }
});

// Delete User
/**
 * @openapi
 * /api/users/{id}:
 *  delete:
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
 *              type: string
 *      responses:
 *          '200':
 *              description: Document updated
 *          '500':
 *              description: Server Exception
 *          '501':
 *              description: MongoDB Exception
 */

router.delete("/:id", async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        console.log(err);
        const deleteUserMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal sever error",
          err
        );
        res.status(500).send(deleteUserMongodbErrorResponse.toObject());
      } else {
        console.log(user);

        user.set({
          isDisabled: true,
          dateModified: new Date(),
        });

        user.save(function (err, savedUser) {
          if (err) {
            console.log(err);
            const savedUserMongodbErrorResponse = new ErrorResponse(
              500,
              "Internal server error",
              err
            );
            res.json(savedUserMongodbErrorResponse.toObject());
          } else {
            console.log(savedUser);
            const savedUserResponse = new BaseResponse(
              200,
              "Query successful",
              savedUser
            );
            res.json(savedUserResponse.toObject());
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
    const deleteUserCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(deleteUserCatchErrorResponse.toObject());
  }
});

router.delete("/deactivate/:userName", async (req, res) => {
  try {
    User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err) {
        console.log(err);
        const deleteUserMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal sever error",
          err
        );
        res.status(500).send(deleteUserMongodbErrorResponse.toObject());
      } else {
        console.log(user);

        user.set({
          isDisabled: true,
          dateModified: new Date(),
        });

        user.save(function (err, savedUser) {
          if (err) {
            console.log(err);
            const savedUserMongodbErrorResponse = new ErrorResponse(
              500,
              "Internal server error",
              err
            );
            res.json(savedUserMongodbErrorResponse.toObject());
          } else {
            console.log(savedUser);
            const savedUserResponse = new BaseResponse(
              200,
              "Query successful",
              savedUser
            );
            res.json(savedUserResponse.toObject());
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
    const deleteUserCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(deleteUserCatchErrorResponse.toObject());
  }
});


/**
 * API queries the users collection by username and return the users registered security questions.
 * findSelectedSecurityQuestions
 */
/**
 * @openapi
 * /api/users/{userName}/security-questions:
 *   get:
 *     tags:
 *       - Users
 *     name: findSelectedSecurityQuestions
 *     description: API to find a registered userName and return this user's saved security questions in the database
 *     summary: Returns a registered user's security questions were saved the database
 *     operationId: findSelectedSecurityQuestions
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         description: find a userName.
 *         scheme:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returned security questions by userName
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:userName/security-questions", async (req, res) => {
  try {
    // find a userName with security questions were saved in the database,  or return an error message
    User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err) {
        console.log(err);
        const findSelectedSecurityQuestionsMongodbErrorResponse =
          new ErrorResponse(500, "Internal server error", e.message);
        res
          .status(500)
          .send(findSelectedSecurityQuestionsMongodbErrorResponse.toObject());
      } else {
        console.log(user);
        const findSelectedSecurityQuestionsResponse = new BaseResponse(
          200,
          "Query successful",
          user.selectedSecurityQuestions
        );
        res.json(findSelectedSecurityQuestionsResponse.toObject());
      }
    });
  } catch (e) {
    console.log(user);
    // Internal server error
    const findSelectedSecurityQuestionsCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res
      .status(500)
      .send(findSelectedSecurityQuestionsCatchErrorResponse.toObject());
  }
});

module.exports = router;
