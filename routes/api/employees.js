const express = require('express');
const router = express.Router();

const employeesController = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/roles_list');

// const verifyJWT = require('../../middleware/verifyJWT')

const path = require('path');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    //? like this we can guard a single route on our API
    // .get(verifyJWT, employeesController.getAllEmployees)
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;

