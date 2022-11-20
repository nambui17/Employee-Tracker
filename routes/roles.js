const roles = require('express').Router();
const sequelize = require('../config/connection.js');
const { QueryTypes } = require('sequelize');

roles.get('/', async (req,res) => {
    const ret = await sequelize.query('SELECT * FROM roles', {type: QueryTypes.SELECT});
    res.json(ret);
});

roles.get('/:id', async (req,res) => {
    const ret = await sequelize.query('SELECT * FROM roles WHERE id = ?', 
    {
        replacements: [req.params.id],
        type: QueryTypes.SELECT
    });
    res.json(ret);
});

module.exports = roles;