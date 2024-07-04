const mysql = require('mysql')
const express = require('express')
const app = express();
// const {ToDo} = require('./initializingDB')
const connection = require('./db');


const NewTask = async (req,res) => {

    //adding new task into database
    const taskData = req.body;
    console.log("adding New Task: ", taskData)
    const {username, taskContent, parentID, participants} = taskData;
    try {
        // const todo = await ToDo.create({username, taskContent, parentID, completed: false, participants})
        // res.status(201).json(todo)

        const query = `INSERT INTO todos (username, taskContent, parentID, completed, participants, usersAssigned, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        connection.query(query, [username, taskContent, parentID, false, JSON.stringify(participants), null , new Date(), new Date()], (err, result) => {
            if (err) {
                console.error('Creating New Task Error:', err);
                res.status(403).json({ error: err.message });
            } else {
                console.log('New task created successfully');
                res.status(201).json({ message: 'New task created successfully', taskData });
            }
        });


        
    } catch (error) {
        console.log('Creating New Task Error: ' + error)
        res.status(403).json({error: error.message})
    }
}

module.exports = NewTask;