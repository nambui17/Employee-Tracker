const employees = require('express').Router();
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
);

employees.get('/', async (req,res) => {
    db.query('SELECT * FROM employees', function (err, results) {
        res.json(results);
    });
});

employees.get('/:id', (req,res) => {
    db.query('SELECT * FROM employees WHERE id = ?', req.params.id, (err,result) => {
        res.json(result);
    });
});

module.exports = employees;