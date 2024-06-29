// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {User, Friend} = require('./models');
const connection = require("./db");


const searchUsers = async (req,res) => {
    const {username} = req.query;
    try {
      const query = `SELECT username FROM sakila.accounts WHERE username LIKE ? LIMIT 10`;
      connection.query(query, [`${username}%`], (err, result) => {
          if (err) throw err;
          let searched = result.map(user => user.username)
          return res.json({ searched });
      });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({error: 'Internal server error'});
  }
}


const addFriend = async (req,res) => {
  const {userId, friendUsername} = req.body;
  try {
    console.log("adding friend from : " + userId + " and " + friendUsername)

    const query = 'INSERT INTO sakila.friends (user_id, friend_id, status ) VALUES (?, ?, ?)';  
    connection.query(query, [userId, friendUsername, "pending"], (error, result) => {
      return res.json({result})

    });
} catch (error) {
  console.error('Error searching users:', error);
  res.status(500).json({error: 'Internal server error'});
}
}

const acceptFriend = async (req, res) => {
  const {userId, friendId} = req.body;
  console.log(friendId, userId);
  try {
    const query = 'UPDATE sakila.friends (user_id, friend_id, status) VALUES (?, ?, ?)';
    connection.query(query, [userId, friendId, 'accepted'], (error, result) => {
      if (error) throw error;
      return res.json({result});
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = {searchUsers, addFriend, acceptFriend};
