/*
 Title:role-api-api.js
 Author: Professor Krasso
 Date: 02/23/2023
 Modified By: Andres Macias/Patrick Wolff/April Yang
 Description: role APIs
 */

const express = require('express');
const Role = require('../models/role');
const User = require('../models/user');
const ErrorResponse = require('../services/error-response');
const BaseResponse = require('../services/base-response');
const router = express.Router();






/**
 * API: http://localhost:3000/api/users
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
router.get('/', async (req, res) => {
  try {
    Role.find({}).where('isDisabled').equals(false).exec(function (err, roles) {
      if (err) {
        console.log(err);
        const findAllRolesMongodbErrorResponse = new ErrorResponse('500', 'Internal server error', err);
        res.status(500).send(findAllRolesMongodbErrorResponse.toObject());
      } else {
        console.log(roles);
        const findAllRolesResponse = new BaseResponse('200', 'Query successful', roles);
        res.json(findAllRolesResponse.toObject());
      }
    })
  }
  catch(e) {
    console.log(e);
    const findAllRolesCatchErrorResponse = new ErrorResponse('500', 'Internal server error', e.message);
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
router.get('/:roleId', async (req, res) => {
  try {
    Role.findOne({'_id': req.params.roleId}, function (err, role) {
      if (err) {
        console.log(err);
        const findRoleByIdMongodbErrorResponse = new ErrorResponse('500', 'Internal server error', err);
        res.status(500).send(findRoleByIdMongodbErrorResponse.toObject());
      } else {
        console.log(role);
        const findRoleByIdResponse = new BaseResponse('200', 'Query successful', role);
        res.json(findRoleByIdResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const findRoleByIdCatchErrorResponse = new ErrorResponse('500', 'Internal server error', e.message);
    res.status(500).send(findRoleByIdCatchErrorResponse.toObject());
  }
});


module.exports = router;
