const express = require('express');
const api = require('./routes/index.js');
const helperDepartment = require('./helpers/departmentActions');
const helperEmployee = require('./helpers/employeeActions');
const helperRole = require('./helpers/roleActions');
const inquirer = require('./node_modules/inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', api);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

//Creates a connection to the database
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  promptUser();
});

function promptUser() {
  const questions = [
    {
      type: 'rawlist',
      message: 'Please select your action from the following choices.',
      name: 'action',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role'
      ]
    }
  ];
  inquirer
  .prompt(questions)
  .then((data) => {
    if (data.action === questions[0].choices[0]) {
      helperDepartment.viewAllDepartments();
    } else if (data.action === questions[0].choices[1]) {
      helperRole.viewAllRoles();
    } else if (data.action === questions[0].choices[2]) {
      viewAllEmployees();
    } else if (data.action === questions[0].choices[3]) {
      helperDepartment.addDepartment();
    } else if (data.action === questions[0].choices[4]) {
      addRole();
    } else if (data.action === questions[0].choices[5]) {
      addEmployee();
    } else if (data.action === questions[0].choices[6]) {
      updateEmployeeRole();
    };
  });
};


