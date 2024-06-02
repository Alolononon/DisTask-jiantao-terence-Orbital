const mysql = require('mysql')
const express = require('express')
const app = express();
const {ToDo} = require('./initializingDB')


const completeTask = async (req,res) => {
    console.log('completing task')
    const { id } = req.body;
    try {
        const task = await ToDo.findByPk(id); //finding by primary key(id) 
        
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.completed = !task.completed;
        await task.save();
        res.status(200).json()
    } catch (error) {
        console.error('error completing task: ', error)
        res.status(500).json({error: ' failed to complete task'})
    }

}

module.exports = completeTask;