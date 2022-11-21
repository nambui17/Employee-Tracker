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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', api);

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  promptUser();
});

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
        'View employees by manager',
        'Update employee managers',
        'View employees by department',
        'Delete departments, roles, or employees',
        'View total utilized budget of a department',
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
      updateEmployeeRole();
    } else if (data.action === questions[0].choices[7]){
      viewEmployeesByManager();
    } else if (data.action === questions[0].choices[8]) {
      updateEmployeeManager();
    } else if (data.action === questions[0].choices[9]) {
      viewEmployeesByDepartment();
    } else if (data.action === questions[0].choices[10]) {
      deleteFunctions();
    } else if (data.action === questions[0].choices[11]) {
      budget();
    } else {
      console.log("Done with actions!");
      process.exit();
    }
  });
};

function viewAllDepartments() {
  db.query('SELECT * FROM departments', (err,results) => {
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

async function viewAllRoles() {
  const query = 'SELECT roles.id AS "ID", roles.title AS "Title", roles.salary AS "Salary" , departments.name AS "Department" FROM roles JOIN departments ON roles.department_id = departments.id';
  db.query(query, (err,results) => {
    if (err) {
      throw err;
    }
    console.table(results);
    promptUser();
  });
};

async function addRole() {
  db.query('SELECT * FROM departments', async (err,departments) => {
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
  const query = `SELECT e.id AS "ID", 
  e.first_name AS "First Name", 
  e.last_name AS "Last Name", 
  roles.title AS "Title", 
  roles.salary AS "Salary", 
  IFNULL(CONCAT(m.first_name, " ", m.last_name), 'No Manager') AS "Manager", 
  departments.name AS "Department" 
  FROM employees e 
  LEFT JOIN employees m ON m.id = e.manager_id
  JOIN roles ON e.role_id = roles.id 
  JOIN departments ON e.role_id = departments.id`
  db.query(query, (err,results) => {
    if (err) {
      throw err;
    }
    console.table(results);
    promptUser();
  })
    // results are in form of array of objects can iterate through for generation
};

async function addEmployee() {
  db.query('SELECT * FROM roles', async (err, allRoles) => {
    db.query('SELECT * FROM employees WHERE manager_id IS NULL', async (err, managers) => {
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

async function updateEmployeeRole() {
  db.query('SELECT * FROM employees', async (err, results) => {
    if (err) {
      throw err;
    }
    const employeeSelect = await inquirer
    .prompt([
        {
            type: 'list',
            message: 'Select the employee whose role you would like to update.',
            choices: results.map(employee => ({name:employee.first_name + " " + employee.last_name, value: employee.id})),
            name: 'employee_id'
        }
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
};

function viewEmployeesByManager() {
  db.query('SELECT * FROM employees WHERE manager_id IS NULL', async (err,managers) => {
    const empManage = await inquirer
    .prompt([
      {
        type: 'list',
        message: "View which manager's employees?",
        choices: managers.map((manager) => ({name: manager.first_name, value: manager.id})),
        name: 'manager'
      }
    ])
    console.log(empManage);
    const query = `SELECT e.id AS "ID", 
    e.first_name AS "First Name", 
    e.last_name AS "Last Name"
    FROM employees e
    WHERE e.manager_id = ?`
    db.query(query,empManage.manager,(err,results) => {
      console.table(results);
      promptUser();
    })
  });
};

function updateEmployeeManager() {
  db.query(`SELECT CONCAT(e.first_name, " ", e.last_name) AS "Name", e.id AS "ID" FROM employees e`, async (err,result) => {
    console.log(result);
    const chooseEmployee = await inquirer
    .prompt([
      {
        type: 'list',
        message: "Select the employee whose manager you want to update.",
        choices: result.map((employee) => ({name: employee.Name, value: employee.ID })),
        name: "employee"
      }
    ])
    console.log(chooseEmployee);
    db.query(`SELECT CONCAT(employees.first_name, " ", employees.last_name) AS "name", employees.id AS "ID"
    FROM employees WHERE manager_id IS NULL`, async (err,managers) => {
      const chooseManager = await inquirer
      .prompt([
        {
          type: 'list',
          message: 'Select the manager that you want to assign to this employee.',
          choices: managers.map((manager) => ({name: manager.name, value: manager.ID  })),
          name: 'manage'
        }
      ])
      db.query('UPDATE employees SET ? WHERE ?',[
        {
          manager_id: chooseManager.manage
        },
        {
          id: chooseEmployee.employee
        }
      ], (err,result) => {
        if (err) {
          throw err
        }
        console.log('Employee role updated!\n');
        promptUser();
      })
    })
  })
};

function viewEmployeesByDepartment() {
  db.query(`SELECT name, id FROM departments`, async (err,results) => {
    const selectDep = await inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select the department to view',
        choices: results.map((depart) => ({name: depart.name, value: depart.id})),
        name: 'department'
      }
    ]);
    const query = `SELECT e.id AS "ID", 
    e.first_name AS "First Name", 
    e.last_name AS "Last Name", 
    roles.title AS "Title", 
    roles.salary AS "Salary", 
    IFNULL(CONCAT(m.first_name, " ", m.last_name), 'No Manager') AS "Manager", 
    departments.name AS "Department" 
    FROM employees e 
    LEFT JOIN employees m ON m.id = e.manager_id
    JOIN roles ON e.role_id = roles.id 
    JOIN departments ON e.role_id = departments.id
    WHERE department_id = ?`;
    db.query(query,selectDep.department ,(err, emp) => {
      if (err) {
        throw err;
      }
      console.table(emp);
      promptUser();
    });
  });
};

async function deleteFunctions() {
  const functionDel = await inquirer
  .prompt([
    {
      type: 'list',
      message: 'Select which function to delete',
      choices: ['Department','Role','Employee'],
      name: 'select'
    }
  ]);
  switch (functionDel.select) {
    case 'Department':
      db.query('SELECT id, name FROM departments', async (err,result) => {
        const selDep = await inquirer
        .prompt([
          {
            type: 'list',
            message: 'Select the department to delete',
            choices: result.map((depart) => ({name: depart.name, value: depart.id})),
            name: 'department'
          }
        ]);
        db.query(`DELETE FROM departments WHERE id= ?`,selDep.department, (err,res) => {
          if (err) {
            throw err;
          }
          console.log(`Sucessfully deleted from departments`);
          promptUser();
        })
      });
      break;
    case 'Role':
      db.query('SELECT id, title FROM roles', async (err,result) => {
        const selRole = await inquirer
        .prompt([
          {
            type: 'list',
            message: 'Select the department to delete',
            choices: result.map((titles) => ({name: titles.title, value: titles.id})),
            name: 'titleId'
          }
        ]);
        db.query(`DELETE FROM departments WHERE id= ?`,selRole.titleId, (err,res) => {
          if (err) {
            throw err;
          }
          console.log(`Sucessfully deleted from departments`);
          promptUser();
        });
      });
      break;
    case 'Employee':
      db.query('SELECT id, CONCAT(e.first_name, " ", e.last_name) AS "Name" FROM employees e', async (err,result) => {
        const selEmployee = await inquirer
        .prompt([
          {
            type: 'list',
            message: 'Select the department to delete',
            choices: result.map((employees) => ({name: employees.Name, value: employees.id})),
            name: 'employeeId'
          }
        ]);
        db.query(`DELETE FROM employees WHERE id= ?`, selEmployee.employeeId, (err,res) => {
          if (err) {
            throw err;
          }
          console.log(`Sucessfully deleted from departments`);
          promptUser();
        });
      });
      break;
  }
};

async function budget() {
  db.query(`SELECT name, id FROM departments`, async (err,results) => {
    const selectDep = await inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select the department to view the budget',
        choices: results.map((depart) => ({name: depart.name, value: depart.id})),
        name: 'departmentId'
      }
    ]);
    const query = `SELECT SUM(salary) AS Total
    FROM employees e 
    LEFT JOIN employees m ON m.id = e.manager_id
    JOIN roles ON e.role_id = roles.id 
    JOIN departments ON e.role_id = departments.id
    WHERE department_id = ?`;
    db.query(query,selectDep.departmentId ,(err, emp) => {
      if (err) {
        throw err;
      }
      console.log(`Total Budget: ${emp[0].Total}\n`);
      promptUser();
    });
  });
};

