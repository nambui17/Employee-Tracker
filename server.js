const express = require('express');
const api = require('./routes/index.js');
const inquirer = require('./node_modules/inquirer');
const mysql = require('mysql2');
const conTable = require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
  {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
  },
);

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
  start();
});

function start() {
  promptUser();
};

function promptUser() {
  const questions = [
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'action',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Quit'
      ],
      default: 0
    }
  ];
  inquirer
  .prompt(questions)
  .then((data) => {
    if (data.action === questions[0].choices[0]) {
      viewAllDepartments();
    } else if (data.action === questions[0].choices[1]) {
      viewAllRoles();
    } else if (data.action === questions[0].choices[2]) {
      viewAllEmployees();
    } else if (data.action === questions[0].choices[3]) {
      addDepartment();
    } else if (data.action === questions[0].choices[4]) {
      addRole();
    } else if (data.action === questions[0].choices[5]) {
      addEmployee();
    } else if (data.action === questions[0].choices[6]) {
      updateEmployee();
    } else {
      console.log("Done with actions!")
    }
  });
};

function viewAllDepartments() {
  db.query('SELECT * FROM departments', function (err,results) {
      console.log('\n');
      console.table(results);
      promptUser();
  })
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
          console.log(`${depAdd.department} has been added to the database.`);
          promptUser();
      });
};

function viewAllRoles() {
  db.query('SELECT * FROM roles', function (err,results) {
      console.table(results);
      promptUser();
  })
  // results are in form of array of objects can iterate through for generation
};

async function addRole() {
  db.query('SELECT * FROM departments', async function (err,departments) {
    const roleAdd = await inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the role you want to add?',
            name: 'role'
        },
        {
            type: 'input',
            message: 'What is the salary for the role?',
            name: 'salary'                
        },
        {
            type: 'list',
            message: 'What department does this role belong to?',
            choices: departments.map((department) => ({name: department.name, value: department.id})),
            name: 'depId'
        }
    ]);
    db.query('INSERT INTO roles(title,salary,department_id) VALUES (?,?,?)', [roleAdd.role,roleAdd.salary,roleAdd.depId], (err,result) => {
        if (err) {
            throw err;
        }
        console.log('Role has been successfully added to the roles table\n');
        promptUser();
    });
  })
};

function viewAllEmployees() {
    db.query('SELECT * FROM employees', function (err,results) {
        console.log(results);
        promptUser();
    })
    // results are in form of array of objects can iterate through for generation
};

async function addEmployee() {
  db.query('SELECT * FROM roles', async (err, allRoles) => {
    // id for manager role is 3
    db.query('SELECT * FROM employees WHERE role_id = 3', async (err, managers) => {
      let manageChoices = managers.map(manager => ({name: manager.first_name + " " + manager.last_name, value: manager.id}))
      manageChoices.push({name: 'None', value: null});
      const employeeAdd = await inquirer
      .prompt([
          {
              type: 'input',
              message: 'What is the first name of the employee that you want to add?',
              name: 'first_name'
          },
          {
              type: 'input',
              message: 'What is the last name of the employee that you want to add?',
              name: 'last_name'
          },
          {
              type: 'list',
              message: "What is this employee's role?",
              choices: allRoles.map((role) => ({name: role.title, value: role.id})),
              name: 'role_id'
          },
          {
              type: 'list',
              message: "Who is the employee's manager?",
              choices: manageChoices,
              name: 'manager_id'
          }
      ]);
      db.query('INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)', 
      [
        {first_name: employeeAdd.first_name},
        {last_name: employeeAdd.last_name},
        {role_id: employeeAdd.role_id},
        {manager_id: employeeAdd.manager_id}
      ], (err,result) => {
          if (err) {
              throw err;
          }
          console.log('Employee added!');
          promptUser();
      });
    })
  })
};

async function updateEmployee() {
  db.query('SELECT * FROM employees', async (err, results) => {
    if (err) {
      throw err;
    }
    // done inside a db query because can get list of employees this way. Can map all employees to an object of choices
    const employeeSelect = await inquirer
    .prompt([
        {
            type: 'list',
            message: 'Select the employee whose role you would like to update.',
            /// results are an array of objects each object is different employee, into an object with only the employee_id from the first and last name of the employee
            choices: results.map(employee => ({name:employee.first_name + " " + employee.last_name, value: employee.id})),
            name: 'employee_id'
        }
    // After selecting employee connect to database to have choices of roles to change that employee to.
    ])
    db.query('SELECT * FROM roles', async (err, allRoles) => {
      const roleSelect = await inquirer
      .prompt([
        {
          type: 'list',
          message: "What is the employee's new role?",
          choices: allRoles.map(role => ({name: role.title, value: role.id})),
          name: "role_id" 
        }
      ])
      console.log(roleSelect);

      db.query('UPDATE employees SET ? WHERE ?',[
        {
          role_id: roleSelect.role_id
        },
        {
          id: employeeSelect.employee_id
        }
      ], (err,result) => {
        if (err) {
          throw err
        }
        console.log('Employee role updated!\n');
        promptUser();
      })
    });
  })
}
