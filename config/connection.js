const mysql = require('mysql2');
require('dotenv').config();
const mysqlConnect = mysql.createConnection(
  {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
);

module.exports = mysqlConnect;