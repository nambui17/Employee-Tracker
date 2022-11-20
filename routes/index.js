const express = require('express');

const departmentRouter = require('./departments.js');
const roleRouter = require('./roles.js');
const employeeRouter = require('./employees.js');

const app = express();

app.use('/departments', departmentRouter);
app.use('/roles', roleRouter);
app.use('/employees',employeeRouter);

module.exports = app;