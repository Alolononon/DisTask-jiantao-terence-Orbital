const mysql = require('mysql')
const express = require('express')
const app = express();
const {ToDo} = require('./initializingDB')

const NewTask = async (req,res) => {



    
    //adding new task into database
    const taskData = req.body;
    console.log("adding New Task: ", taskData)
    const {username, taskContent, parentID} = taskData;
    try {
        const todo = await ToDo.create({username, taskContent, parentID, completed: false})
        res.status(201).json(todo)
    } catch (error) {
        console.log('Error: ' + error)
        res.status(403).json({error: error.message})
    }

    

}

module.exports = NewTask;