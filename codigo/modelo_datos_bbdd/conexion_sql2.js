// get the client
const mysql = require('mysql2');
const env = require('../config/env');

// create the connection to database
const connectionSync = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const connectionAsync = connectionSync.promise();

module.exports = connectionAsync;