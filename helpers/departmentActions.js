const mysql = require('mysql2');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

async function viewAllDepartments() {
    const results = await sequelize.query('SELECT * FROM departments', {type: QueryTypes.SELECT});
    console.log(results);
};

async function addDepartment() {
    sequelize.query('INSERT INTO departments')
};

module.exports = {
    viewAllDepartments,
    addDepartment
}