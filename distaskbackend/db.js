// const mysql = require('mysql');

// const pool = mysql.createPool({
//     connectionLimit: 10,
//     //host: 'localhost',
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'root',
//     password: '794613',
//     database: 'sakila'
// })

// module.exports = pool;


var mysql = require("mysql")

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'sakila',
    user: 'root',
    password: '794613'
    
});

module.exports = connection;