const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize for the User database
const sequelizeUser = new Sequelize('sakila', 'root', '794613', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = sequelizeUser.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelizeUser.sync()
  .then(() => console.log('User table created successfully in user_database.'))
  .catch(err => console.log('Error: ' + err));

module.exports = { sequelizeUser, User };
