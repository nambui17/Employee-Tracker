const departments = require('express').Router();
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

departments.get('/', async (req,res) => {
    db.query('SELECT * FROM departments', function (err, results) {
        res.json(results);
    });
});

departments.get('/:id', (req,res) => {
    db.query('SELECT * FROM departments WHERE id = ?', req.params.id, (err,result) => {
        res.json(result);
    });
});

module.exports = departments;