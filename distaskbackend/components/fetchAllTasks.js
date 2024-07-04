const mysql = require('mysql')
const express = require('express')
const app = express();
// const {ToDo} = require('./initializingDB')
// const {Sequelize, Op}  = require('sequelize')
const connection = require('./db');

const fetchAllTasks = async (req, res) => {
    try {
        const {username} = req.body;

        // const tasks = await ToDo.findAll({
        //     where: {
        //         [Op.and]: [
        //             Sequelize.literal(`JSON_CONTAINS(participants, '"${username}"')`)
        //         ]
        //     }
        // });
        // res.status(200).json({ tasks});

        const query = `SELECT * FROM todos WHERE JSON_CONTAINS(participants, '"${username}"')`;
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching tasks:', err);
                res.status(500).json({ error: 'Failed to fetch tasks' });
            } 
            const tasks = results.map(task => {
                // Parse the participants field from JSON string to array
                const parsedParticipants = JSON.parse(task.participants);
                return {
                    ...task,
                    participants: parsedParticipants // Replace the participants field with the parsed array
                };
            });
            return res.status(200).json({ tasks: results });
            
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
    
}


module.exports = fetchAllTasks;
