// models/Friend.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sakila', 'root', '794613', {
  host: 'localhost',
  dialect: 'mysql',
});
const User = require('./User'); // import User model

const Friend = sequelize.define('Friend', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  friendId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// Define many-to-many association
User.belongsToMany(User, { through: Friend, as: 'Friends', foreignKey: 'userId', otherKey: 'friendId' });
User.belongsToMany(User, { through: Friend, as: 'FriendOf', foreignKey: 'friendId', otherKey: 'userId' });

module.exports = Friend;
