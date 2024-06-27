// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sakila', 'root', '794613', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = require('./User');
const Friend = require('./Friend');

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync models
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initializeDatabase();

module.exports = { User, Friend, sequelize };
