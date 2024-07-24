
import React, { useState, useEffect } from 'react';
import axios from 'axios'; //some popular js library i found that is needed :O
import './Friends.css'
import fetchMultipleProfilePic from '../components/FetchMultipleProfilePic';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const username = sessionStorage.getItem('username');


  useEffect(() => {
    // Fetch friendlist from the backend
    const fetchfriendlist = async () => {
      try{
        const response = await axios.post('http://localhost:5000/friendlist', {
          username
        })
        setFriends(response.data.friends)
      }catch(err){
        console.error(err)
      }
    }
    fetchfriendlist();
  }, []);

  const[friendsPic,setFriendsPic] = useState({})
  useEffect(()=>{
    const fetchProfilePics = async () => {
      if (friends.length > 0) {
        const pics = await fetchMultipleProfilePic(friends);
        setFriendsPic(pics);
      } else {
        setFriendsPic({});
      }
    }
    fetchProfilePics();
  },[friends])

  useEffect(()=>{
    console.log(friendsPic)
  },[friendsPic])
    

  return (
    <div>
      <h1 className='left-shift'>Friends List</h1>
      <ul className='friend_list'>
        {friends.map((user,index) => (
          

          
          <li key={index} className='users_item'>
            <div>
              {friendsPic[user] && friendsPic[user]!==null && (
                <img src={`data:image/jpeg;base64,${friendsPic[user]}`} alt={`${user}'s profile`} className='profilePic' />
              )}
              
              {user}

            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
