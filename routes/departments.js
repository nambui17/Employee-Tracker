const departments = require('express').Router();
const sequelize = require('../config/connection.js');
const { QueryTypes } = require('sequelize');

departments.get('/', async (req,res) => {
    const ret = sequelize.query('SELECT * FROM departments', {type: QueryTypes.SELECT});
    res.json(ret);
});

departments.get('/:id', async (req,res) => {
    const ret = await sequelize.query('SELECT * FROM roles WHERE id = ?', 
    {
        replacements: [req.params.id],
        type: QueryTypes.SELECT
    });
    res.json(ret);
});

module.exports = departments;