// get the client
const mysql = require('mysql2');

// create the connection to database
const connectionSync = mysql.createConnection({
    host: 'localhost',
    database: 'cortocircuito',
    user: 'root',
    password: '',
});

const connectionAsync = connectionSync.promise();

module.exports = connectionAsync;