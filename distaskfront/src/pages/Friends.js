
import React, { useState, useEffect } from 'react';
import axios from 'axios'; //some popular js library i found that is needed :O
import './Friends.css'

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const username = sessionStorage.getItem('username');


  useEffect(() => {
    // Fetch friendlist from the backend
    const fetchfriendlist = async () => {
      try{
        const response = await axios.post('http://localhost:5000/friendlist', {
        //const response = await axios.post('https://distask-backend.vercel.app/friendlist', {
          username
        })
        setFriends(response.data.friends)
      }catch(err){
        console.error(err)
      }
    }
    fetchfriendlist();
  }, []);

    

  return (
    <div>
      <h1>Friends List</h1>
      <ul className='friend_list'>
        {friends.map((user,index) => (
          <li key={index} className='users_item'>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
