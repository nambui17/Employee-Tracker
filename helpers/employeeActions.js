const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
);

function viewAllEmployees() {
    db.query('SELECT * FROM departments', function (err,results) {
        console.log(results)
    })
    // results are in form of array of objects can iterate through for generation
};

async function addEmployee() {
    const employeeAdd = await inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the first name of the employee that you want to add?',
                name: 'first'
            },
            {
                type: 'input',
                message: 'What is the last name of the employee that you want to add?',
                name: 'last'
            },
            {
                type: 'input',
                message: 'What is the role id number of the employee?',
                name: 'role'
            },
            {
                type: 'input',
                message: "Who is the employee's manager?",
                name: 'manager'
            }
        ]);
        db.query('INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)', [employeeAdd.first,employeeAdd.last,employeeAdd.role,employeeAdd.manager], (err,result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
        });
};

module.exports = {
    viewAllEmployees,
    addEmployee
}