

var mysql = require("mysql")

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'sakila',
    user: 'root',
    password: '794613'
    
});


// var connection = mysql.createConnection({
//     host: 'distask.czwce6yy6dap.ap-southeast-2.rds.amazonaws.com',
//     port: 3306,
//     database: 'sakila',
//     user: 'taop3',
//     password: 'Password1!!!'
// })

module.exports = connection;