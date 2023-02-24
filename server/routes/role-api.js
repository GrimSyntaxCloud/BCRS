/*
 Title:role-api-api.js
 Author: Professor Krasso
 Date: 02/23/2023
 Modified By: Andres Macias/Patrick Wolff/April Yang
 Description: role APIs
 */

const express = require("express");
const Role = require("../models/role");
const User = require("../models/user");
const ErrorResponse = require("../services/error-response");
const BaseResponse = require("../services/base-response");
const router = express.Router();

/**
 * API: http://localhost:3000/api/roles
 * findAllRoles
 */
/**
 * @openapi
 * /api/roles:
 *   get:
 *     tags:
 *       - Roles
 *     name: findAllRoles
 *     description: Returns all roles.
 *     summary: Returns all roles available in the database.
 *     operationId: findAllRoles
 *     responses:
 *       '200':
 *         description: Returned all roles
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/", async (req, res) => {
  try {
    Role.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, roles) {
        if (err) {
          console.log(err);
          const findAllRolesMongodbErrorResponse = new ErrorResponse(
            "500",
            "Internal server error",
            err
          );
          res.status(500).send(findAllRolesMongodbErrorResponse.toObject());
        } else {
          console.log(roles);
          const findAllRolesResponse = new BaseResponse(
            "200",
            "Query successful",
            roles
          );
          res.json(findAllRolesResponse.toObject());
        }
      });
  } catch (e) {
    console.log(e);
    const findAllRolesCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(findAllRolesCatchErrorResponse.toObject());
  }
});

/**
 * API: http://localhost:3000/api/roles/:id
 * findRoleById
 */
/**
 * @openapi
 *  /api/roles/{roleId}:
 *    get:
 *      tags:
 *        - Roles
 *      name: findRoleById
 *      description: finds role by Id
 *      summary: retrieves a role from the database using its id
 *      operationId: findRoleById
 *      parameters:
 *        - name: roleId
 *          in: path
 *          required: true
 *          description: find the role by id
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: role found
 *        '500':
 *          description: Server Exception
 *        '501':
 *          description: MongoDB Exception
 */
router.get("/:roleId", async (req, res) => {
  try {
    Role.findOne({ _id: req.params.roleId }, function (err, role) {
      if (err) {
        console.log(err);
        const findRoleByIdMongodbErrorResponse = new ErrorResponse(
          "500",
          "Internal server error",
          err
        );
        res.status(500).send(findRoleByIdMongodbErrorResponse.toObject());
      } else {
        console.log(role);
        const findRoleByIdResponse = new BaseResponse(
          "200",
          "Query successful",
          role
        );
        res.json(findRoleByIdResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const findRoleByIdCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(findRoleByIdCatchErrorResponse.toObject());
  }
});

// deleteRole
/**
 * @openapi
 * /api/roles/{roleId}:
 *   delete:
 *     tags:
 *       - Roles
 *     name: deleteRole
 *     description: Reads,retrieves a role by id and deletes it.
 *     summary: deletes a role by id
 *     operationId: deleteRole
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: id of a role
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Query successful.
 *       '400':
 *         description: Role is already in use and cannot be deleted.
 *       '500':
 *         description: Server Exception.
 */
router.delete("/:roleId", async (req, res) => {
  try {
    // Find the role by document id
    Role.findOne({ _id: req.params.roleId }, function (err, role) {
      if (err) {
        console.log(err);
        const deleteRoleMongodbErrorResponse = new ErrorResponse(
          "500",
          "Internal server error",
          err
        );
        res.status(500).send(deleteRoleMongodbErrorResponse.toObject());
      } else {
        console.log(role);
        // Aggregate query to determine if the role being delete is already mapped to an existing uer
        User.aggregate(
          [
            {
              $lookup: {
                from: "roles",
                localField: "role.text",
                foreignField: "text",
                as: "userRoles",
              },
            },
            {
              $match: {
                "userRoles.text": role.text,
              },
            },
          ],
          function (err, users) {
            console.log(users);
            if (err) {
              console.log(err);
              const usersMongodbErrorResponse = new ErrorResponse(
                "500",
                "Internal server error",
                err
              );
              res.status(500).send(usersMongodbErrorResponse.toObject());
            } else {
              //If the query returns one or more users, then the role is already in use and shouldn't be disabled
              if (users.length > 0) {
                console.log(
                  `Role < ${role.text} > is already in use and cannot be deleted`
                );
                const userRoleAlreadyInUseResponse = new BaseResponse(
                  400,
                  `Role '${role.text}' is in use.`,
                  role
                );
              } else {
                //otherwise, the role requesting to be disabled is not in use and can be safely removed.
                console.log(
                  `Role < ${role.text}> is not an active role and can be safely removed`
                );

                role.set({
                  isDisabled: true,
                });

                role.save(function (err, updatedRole) {
                  if (err) {
                    console.log(err);
                    const updatedRoleMongodbErrorResponse = new ErrorResponse(
                      "500",
                      "Internal server error",
                      err
                    );
                    res
                      .status(500)
                      .send(updatedRoleMongodbErrorResponse.toObject());
                  } else {
                    console.log(updatedRole);
                    const roleDeletedResponse = new BaseResponse(
                      "200",
                      `Role '${role.text}' has been removed successfully`,
                      updatedRole
                    );
                    res.json(roleDeletedResponse.toObject());
                  }
                });
              }
            }
          }
        );
      }
    });
  } catch (e) {
    console.log(e);
    const deleteRoleCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(deleteRoleCatchErrorResponse.toObject());
  }
});

/**
 * CreateRole
 */
/** createRole
 * @openapi
 * /api/roles:
 *   post:
 *     tags:
 *       - Roles
 *     description: API to create new role objects.
 *     summary: Creates a new role object
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *              role:
 *                type: string
 *     responses:
 *       '200':
 *         description: Query successful
 *       '500':
 *         description: Internal server error
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/', async (req, res) => {
  try
  {
    Role.findOne({'text': req.body.text}, function(err, role) {
      if (err) {
        console.log(err);
        const findRoleMongodbError = new ErrorResponse(500, 'Internal server error', err);
        res.status(500).send(findRoleMongodbError.toObject());
      } else {
        console.log(role);

        if (!role) {

          const newRole = {
            text: req.body.text
          }

          Role.create(newRole, function(err, role)
          {
            if (err)
            {
              console.log(err);
              const createRoleMongodbErrorResponse = new ErrorResponse('500', 'Internal server error', err);
              res.status(500).send(createRoleMongodbErrorResponse.toObject());
            }
            else
            {
              console.log(role);
              const createRoleResponse = new BaseResponse('200', 'Query successful', role);
              res.json(createRoleResponse.toObject());
            }
          })
        } else {
          console.log(`Role: ${req.body.text} already exists`);
          const roleAlreadyExists = new ErrorResponse(200, `Role '${req.body.text}' already exists. If you do not see the role in the list then it means it was disabled`, null);
          res.status(200).send(roleAlreadyExists.toObject());
        }
      }
    })
  }
  catch (e)
  {
    console.log(e);
    const createRoleCatchErrorResponse = new ErrorResponse('500', 'Internal server error', e.message);
    res.status(500).send(createRoleCatchErrorResponse.toObject());
  }
});





module.exports = router;
