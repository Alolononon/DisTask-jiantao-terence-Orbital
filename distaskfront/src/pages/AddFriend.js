import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AddFriend.css"
import fetchMultipleProfilePic from '../components/FetchMultipleProfilePic';

function AddFriend() {
  const [friendUsername, setFriendUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outcomingRequests, setOutcomingRequests] = useState([]);
  const [refresh, setRefresh] = useState(false)
  const username = sessionStorage.getItem('username');
  const [friendlist, setFriendList] = useState([])

  //fetch data
  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        // Fetch incoming friend requests
        const response = await axios.post('http://localhost:5000/fetchfrienddata', {
          params: {userId: sessionStorage.getItem('username')}
        });
        setIncomingRequests(response.data.friend_request_received)
        //console.log(incomingRequests)
        setOutcomingRequests(response.data.friend_request_sent)
        //console.log(outcomingRequests)

        //find friendlist
        const response1 = await axios.post('http://localhost:5000/friendlist', {username})
        setFriendList(response1.data.friends)

      } catch (error) {
        console.error('Error fetching incoming requests:', error);
      }
    };
    fetchIncomingRequests();
  }, [searchResults,friendUsername, refresh]);

  //for searching friend request
  const handleUsernameChange = async (event) => {
    const searching = event.target.value;
    setFriendUsername(searching);

    if (searching.trim() !== '') {
      try {
        const response = await axios.get(`http://localhost:5000/searchUsers?searching=${searching}&username=${username}`);
        setSearchResults(response.data.searched);
        
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };
  const handleSearchUsers = async () => {
    if (friendUsername.trim() !== '') {
      try {
        const response = await axios.get(`http://localhost:5000/searchUsers?searching=${friendUsername}&username=${username}`);
        setSearchResults(response.data.searched);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // SENDING FRIEND REQUEST
  const handleAddFriend = async (friendId) => {
    try {
      const response = await axios.post('http://localhost:5000/addFriend', {
        userId: sessionStorage.getItem('username'), 
        friendUsername: friendId 
      });
      console.log('Friend added:', response.data);
      setFriendUsername('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };



  // New thing added delete this comment when checked
  const handleAcceptFriend = async (friendId) => {
    try {
      const response = await axios.post('http://localhost:5000/acceptFriend', {
        userId: sessionStorage.getItem('username'),
        friendId
      });
      setRefresh(!refresh)
      //console.log('Friend request accepted:', response.data);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineFriend = async (friendId) => {
    try {
      const response = await axios.post('http://localhost:5000/declineFriend', {
        userId: sessionStorage.getItem('username'),
        friendId
      });
      setRefresh(!refresh)
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  }










  const [profilePics, setProfilePics] = useState([]);
  const [incomingProfilePic, setIncomingProfilePic] = useState([])
  useEffect(() => {
    const fetchProfilePics = async () => {
      if (searchResults.length > 0) {
        const pics = await fetchMultipleProfilePic(searchResults);
        setProfilePics(pics);
      } else {
        setProfilePics([]);
      }

      if (incomingRequests.length > 0) {
        const incomingPic = await fetchMultipleProfilePic(incomingRequests);
        setIncomingProfilePic(incomingPic)
      } else {
        setIncomingProfilePic([])
      }
    };
    fetchProfilePics();
  }, [searchResults,incomingRequests]);








  return (
    <div>
      <h1 className='left-shift'>Add a Friend</h1>
      <div>
        <input
          type="text"
          value={friendUsername}
          onChange={handleUsernameChange}
          placeholder="Search for a friend"
          className='left-shift'
        />
        <button onClick={handleSearchUsers} className='left-shift'>Search</button>
      </div>
      <ul className='friend_list'>
        {searchResults.map((user, index) => (
          <li key={index} className='users_item'>

            {profilePics[index] && profilePics[index].profilePic!==null && (
              <img src={`data:image/jpeg;base64,${profilePics[index].profilePic}`} alt={`${user}'s profile`} className='profilePic' />
            )}
            <span className='friendname'> {user} </span>


            {friendlist.includes(user)
            ? (<button disabled className='disabled_button'>Friend</button>)
            : incomingRequests.includes(user) || outcomingRequests.includes(user)
            ? (<button disabled className='disabled_button'> Pending</button>)
            : (<button onClick={() => handleAddFriend(user)}>Add Friend</button>)
          }
          </li>
        ))}
      </ul>
      <h2 className='left-shift'>Incoming Requests</h2>
      <ul className='friend_list'>
        {incomingRequests.map((user, index) => (
          <li key={index} className='users_item'>
            {incomingProfilePic[index] && incomingProfilePic[index].profilePic!==null && (
              <img src={`data:image/jpeg;base64,${incomingProfilePic[index].profilePic}`} alt={`${user}'s profile`} className='profilePic' />
            )}
            <span className='friendname'> {user} </span>
            <button onClick={() => handleAcceptFriend(user)} className='right-shift'>Accept</button>
            <button onClick={()=> handleDeclineFriend(user)}className='right-shift'>Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddFriend;
