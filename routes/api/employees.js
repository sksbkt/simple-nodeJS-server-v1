const express = require('express');
const router = express.Router();

const employeesController = require('../../controllers/employeesController');

// const verifyJWT = require('../../middleware/verifyJWT')

const path = require('path');


router.route('/')
    //? like this we can guard a single route on our API
    // .get(verifyJWT, employeesController.getAllEmployees)
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;

