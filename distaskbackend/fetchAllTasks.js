const mysql = require('mysql')
const express = require('express')
const app = express();
const {ToDo} = require('./initializingDB')
const {Sequelize, Op}  = require('sequelize')

const fetchAllTasks = async (req, res) => {
    try {
        const {username} = req.body;
        // const incompleteTasks = await ToDo.findAll({
        //     where: {
        //         completed: false,
        //         [Op.and]: [
        //             Sequelize.literal(`JSON_CONTAINS(participants, '"${username}"')`)
        //         ]
        //     }
        // });

        // const completedTasks = await ToDo.findAll({
        //     where: {
        //         completed: true,
        //         [Op.and]: [
        //             Sequelize.literal(`JSON_CONTAINS(participants, '"${username}"')`)
        //         ]
        //     }
        // });
    //     res.status(200).json({
    //                         incompleteTasks:incompleteTasks,
    //                         completedTasks: completedTasks
    // })

    const tasks = await ToDo.findAll({
        where: {
            [Op.and]: [
                Sequelize.literal(`JSON_CONTAINS(participants, '"${username}"')`)
            ]
        }
    });
    res.status(200).json({tasks})



    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
    
}


module.exports = fetchAllTasks;
