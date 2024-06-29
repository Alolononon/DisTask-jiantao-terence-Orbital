

// import React, { useState } from 'react';
// import axios from 'axios';

// function AddFriend() {
//   const [friendUsername, setFriendUsername] = useState('');
//   const [searchResults, setSearchResults] = useState([]);

//   const handleUsernameChange = async (event) => {
//     const username = event.target.value;
//     setFriendUsername(username);

//     if (username.trim() !== '') {
//       try {
//         const response = await axios.get(`http://localhost:5000/searchUsers?username=${username}`);
//         setSearchResults(response.data);
//       } catch (error) {
//         console.error('Error searching users:', error);
//       }
//     } else {
//       setSearchResults([]);
//     }
//   };

//   const handleAddFriend = async (friendId) => {
//     try {
//       const response = await axios.post('http://localhost:5000/addFriend', {
//         userId: sessionStorage.getItem('token'), // Replace with actual logged-in user ID
//         friendUsername: friendId // Assuming friendId is the actual ID of the user selected from search
//       });
//       console.log('Friend added:', response.data);
//       setFriendUsername('');
//       setSearchResults([]);
//     } catch (error) {
//       console.error('Error adding friend:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Add a Friend</h1>
//       <input
//         type="text"
//         value={friendUsername}
//         onChange={handleUsernameChange}
//         placeholder="Search for a friend"
//       />
//       <ul>
//         {searchResults.map((user) => (
//           <li key={user.id}>
//             {user.username}
//             <button onClick={() => handleAddFriend(user.id)}>Add Friend</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default AddFriend;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AddFriend.css"

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

  //text shown
  return (
    <div>
      <h1>Add a Friend</h1>
      <div>
        <input
          type="text"
          value={friendUsername}
          onChange={handleUsernameChange}
          placeholder="Search for a friend"
        />
        <button onClick={handleSearchUsers}>Search</button>
      </div>
      <ul className='friend_list'>
        {searchResults.map((user, index) => (
          <li key={index} className='users_item'>
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
      <h2>Incoming Requests</h2>
      <ul className='friend_list'>
        {incomingRequests.map((user, index) => (
          <li key={index} className='users_item'>
            <span className='friendname'> {user} </span>
            <button onClick={() => handleAcceptFriend(user)}>Accept</button>
            <button onClick={()=> handleDeclineFriend(user)}>Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddFriend;
