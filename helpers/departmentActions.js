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

function viewAllDepartments() {
    db.query('SELECT * FROM departments', function (err,results) {
        console.log(results)
    })
    // results are in form of array of objects can iterate through for generation
};

async function addDepartment() {
    const depAdd = await inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department you want to add?',
                name: 'department'
            }
        ]);
        db.query('INSERT INTO departments(name) VALUES (?)', depAdd.department, (err,result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
        });
};

module.exports = {
    viewAllDepartments,
    addDepartment
}