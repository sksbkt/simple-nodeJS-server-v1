const { parse } = require('date-fns');

const Employee = require('../model/Employee')

// const data = {
//     employees: require('../model/employees.json'),
//     setEmployees: function (data) { this.employees = data },
//     updateEmployee: function (data, index) {
//         this.employees[index] = data;
//     }
// };


async function getAllEmployees(req, res) {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'no employees found' });
    res.json(employees);
}

async function createNewEmployee(req, res) {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'first and last name are required' });
    }
    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        });
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.sendStatus(503);//? 503:: service not available
    }
}
// async function createNewEmployee(req, res) {


// const newEmployee = {
//     id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
//     firstname: req.body.firstname,
//     lastname: req.body.lastname,

// }

// if (!newEmployee.firstname || !newEmployee.lastname) {
//     return res.status(400).json({ 'message': 'First and Last name are required.' })
// }
// data.setEmployees([...data.employees, newEmployee]);
// res.status(201).json(data.employees);

// }

async function updateEmployee(req, res) {

    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID:${req.body.id}` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

// function updateEmployee(req, res) {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee id:${req.body.id} not found` });
//     }
//     if (req.body.firstname) employee.firstname = req.body.firstname;
//     if (req.body.lastname) employee.lastname = req.body.lastname;
//     // const index = data.employees.findIndex(x => x.id === parseInt(req.body.id))
//     // console.log(index);
//     // data.updateEmployee(employee, index);
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     const unsortedArray = [...filteredArray, employee];
//     data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
//     res.json(data.employees);
// }

async function deleteEmployee(req, res) {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required' });
    }
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(400).json({ "message": `Employee id:${req.body.id} not found` });
    }
    const result = await employee.deleteOne({ _id: req.body.id });
    res.status(202).json(result);

}
// function deleteEmployee(req, res) {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee id:${req.body.id} not found` });
//     }
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     data.setEmployees([...filteredArray]);
//     res.status(202).json(data.employees);

// }

async function getEmployee(req, res) {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required' });
    }
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(400).json({ "message": `Employee id:${req.params.id} not found` });
    }
    res.json(employee);
}

// function getEmployee(req, res) {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee id:${req.params.id} not found` });
//     }
//     res.json(employee)
// }

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}