// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const connection = require("./db");


const searchUsers = async (req,res) => {
    const {searching,username} = req.query;
    try {
      const query = `SELECT username FROM sakila.accounts WHERE username LIKE ? LIMIT 10`;
      connection.query(query, [`${searching}%`], (err, result) => {
          if (err) throw err;
          let searched1 = result.map(user => user.username)
          const searched = searched1.filter(user=> user!==username)
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



const fetchfrienddata = async (req,res) => { 
  const {userId} = req.body.params;
  let friend_request_sent = []
  let friend_request_received = []
  
  try{
    const query1 =  'SELECT friend_id FROM sakila.friends WHERE user_id =? AND status = "pending"'
    connection.query(query1, [userId], (err,result) => {
      if(err) {
        console.error("Error fetching friend request data: ", error)
        return res.status(500).json({ error: 'Internal server error' });
      };
      friend_request_sent = result.map(data => data.friend_id)
      
      const query2 = 'SELECT user_id FROM sakila.friends WHERE friend_id =? AND status = "pending"'
      connection.query(query2, [userId], (err,result) => {
        if(err) {
          console.error("Error fetching friend received data: ", error)
          return res.status(500).json({ error: 'Internal server error' });
        };
        friend_request_received = result.map(data => data.user_id)
        
        return res.json({friend_request_sent, friend_request_received}) // main return
      })
    })
  } catch(err){
    console.error("Error fetching friend data: ", err)
    return res.status(500).json({ error: 'Internal server error' });
  }
}


const acceptFriend = async (req, res) => {
  try {
    const {userId, friendId} = req.body;
    const query = 'UPDATE sakila.friends SET status = ? WHERE user_id = ? AND friend_id = ?';
    connection.query(query,['accepted', friendId, userId] , (error, result) => {
      if (error) throw error;
      return res.json({result});
    });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const declineFriend = async (req, res) => {
  try {
    console.log("declining")
    const {userId, friendId} = req.body;
    const query = 'DELETE FROM sakila.friends WHERE user_id = ? AND friend_id = ? AND status = ?';
    connection.query(query,[friendId, userId, 'pending'], (error, result) => {
      if (error) throw error;
      return res.json({result});
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const friendlist = async (req,res) => {
  try {
    const {username} = req.body

    const query = `
    SELECT user_id, friend_id
    FROM sakila.friends
    WHERE user_id = ? AND status = 'accepted'
    UNION
    SELECT user_id, friend_id
    FROM sakila.friends
    WHERE friend_id = ? AND status = 'accepted'
    `;
    
    connection.query(query, [username, username], (err, results) => {
        if (err) throw err;

        const friends = results.map(data => {
            return data.user_id === username ? data.friend_id : data.user_id;
        })
        return res.json({friends});
      });
  } catch (err) {
    console.error('Error fetching friendlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = {searchUsers, addFriend, acceptFriend, fetchfrienddata, friendlist, declineFriend};
