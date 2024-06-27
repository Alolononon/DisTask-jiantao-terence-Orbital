// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {User, Friend} = require('./models');

// Search for users by username
router.get('/searchUsers', async (req, res) => {
  const {username} = req.query;

  try {
    const users = await User.findAll({
      where: {
        username: {
          [Sequelize.Op.like]: `%${username}%` //any word in username will be searched for
        }
      }
    });
    //error
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});


// Add a friend
router.post('/addFriend', async (req, res) => {
  const {userId, friendUsername} = req.body;
  
  try {
    const friend = await User.findOne({where: {username: friendUsername}});
    if (!friend) {
      return res.status(404).json({error: 'Friend not found'});
    }

    await Friend.create({userId, friendId: friend.id});
    res.status(201).json({message: 'Friend added successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Add a friend
router.post('/addFriend', async (req, res) => {
  const {userId, friendId} = req.body;

  try {
    // Check if the friendship already exists
    const existingFriendship = await Friend.findOne({
      where: {
        userId,
        friendId,
      },
    });

    if (existingFriendship) {
      return res.status(400).json({error: 'Friendship already exists'});
   }

    // Create the friendship
    await Friend.create({userId, friendId});
    res.status(201).json({message: 'Friend added successfully'});
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({error: 'Internal server error' });
  }
});

// // Get all friends for a user
// router.get('/friends/:userId', async (req, res) => {
//   const {userId } = req.params;

//   try {
//     const user = await User.findByPk(userId, {
//       include: [
//         {model: User, as: 'Friends' }
//       ]
//     });

//     if (!user) {
//       return res.status(404).json({error: 'User not found' });
//     }

//     res.json(user.Friends);
//   } catch (error) {
//     res.status(500).json({error: error.message });
//   }
// });

module.exports = router;
