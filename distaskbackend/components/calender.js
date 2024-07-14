const bodyParser = require('body-parser');
const connection = require('./db');


const calender = async (req,res) => {
    const response = req.body;

    if(response.action==="Add Duedate on Task"){
        const {taskId, dueDate} = response;
        const query = `UPDATE sakila.todos SET dueDate = ? WHERE id = ?`;
        connection.query(query, [JSON.stringify(dueDate), taskId], (err, results) => {
            if (err) throw err;
            return res.status(200).json({})
            }) 
    }
    
    if(response.action==="Deleting Duedate on Task"){
        const {taskId} = response;
        const query = `UPDATE sakila.todos SET dueDate = ? WHERE id = ?`;
        connection.query(query, [null, taskId], (err, results) => {
            if (err) throw err;
            return res.status(200).json({})
            }) 
    }



}

module.exports = calender