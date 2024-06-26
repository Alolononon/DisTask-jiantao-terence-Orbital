const {Sequelize, DataTypes} = require('sequelize')
    

    // syncing table with database      //should be in initializing at the start of database?
    const sequelize = new Sequelize('sakila', 'root', '794613', {
        host: 'localhost',
        dialect: 'mysql',
      });
    const ToDo = sequelize.define('ToDo', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    taskContent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parentID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    completed: {
     type: DataTypes.BOOLEAN,
     allowNull: false,  
     defaultValue: false, 
    }
    }, {
    timestamps: true,   // automatically adds createdAt and updatedAt
    tableName: 'todos'  // explicit table name if different from model name
    });


    sequelize.sync()    // Sync the model with the database
    .then(() => console.log('ToDo table created successfully.'))
    .catch(err => console.log('Error: ' + err));

    module.exports = {sequelize, ToDo};