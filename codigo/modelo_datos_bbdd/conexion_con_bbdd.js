//codigo para conectar con basa de datos

const mysql=require('mysql')
const env = require('../config/env');

var connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    dateStrings: 'date'
  });


  connection.connect(function(err) {
    if (err) {
      console.error('Error connecting: ' + err.stack);
      return;
    }
   
    console.log('Connected as ID ' + connection.threadId);
  });


module.exports= connection 
   