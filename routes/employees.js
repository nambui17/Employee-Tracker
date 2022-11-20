const employees = require('express').Router();
const sequelize = require('../config/connection.js');
const { QueryTypes } = require('sequelize');

employees.get('/', async (req,res) => {
    const ret = sequelize.query('SELECT * FROM employees', {type: QueryTypes.SELECT});
    res.json(ret);
});

employees.get('/:id', async (req,res) => {
    const ret = await sequelize.query('SELECT * FROM roles WHERE id = ?', 
    {
        replacements: [req.params.id],
        type: QueryTypes.SELECT
    });
    res.json(ret);
});

module.exports = employees;