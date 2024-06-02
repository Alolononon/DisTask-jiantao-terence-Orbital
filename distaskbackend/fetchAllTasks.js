const mysql = require('mysql')
const express = require('express')
const app = express();
const {ToDo} = require('./initializingDB')


const fetchAllTasks = async (req, res) => {
    console.log('here11')
    try {
        const {username} = req.body;
        const incompleteTasks = await ToDo.findAll({where: {
                                                username,
                                                completed: false,
                                            } });
        const completedTasks = await ToDo.findAll({ where: {
                                                    username,
                                                    completed: true,
        } });
        res.status(200).json({
                            incompleteTasks:incompleteTasks,
                            completedTasks: completedTasks
    })
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
    
}


module.exports = fetchAllTasks;
