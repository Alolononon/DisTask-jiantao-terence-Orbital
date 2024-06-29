

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

function AddFriend() {
  const [friendUsername, setFriendUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  useEffect(() => {
    // Fetch incoming friend requests
    const fetchIncomingRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/incomingRequests', {
          params: {userId: sessionStorage.getItem('username')}
        });
        setIncomingRequests(response.data.requests);
      } catch (error) {
        console.error('Error fetching incoming requests:', error);
      }
    };
    fetchIncomingRequests();
  }, []);


  const handleUsernameChange = async (event) => {
    const username = event.target.value;
    setFriendUsername(username);

    if (username.trim() !== '') {
      try {
        const response = await axios.get(`http://localhost:5000/searchUsers?username=${username}`);
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
      console.log("runnn")
      console.log(friendUsername)
      try {
        const response = await axios.get(`http://localhost:5000/searchUsers?username=${friendUsername}`);
        setSearchResults(response.data.searched);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      const response = await axios.post('http://localhost:5000/addFriend', {
        userId: sessionStorage.getItem('username'), // Replace with actual logged-in user ID
        friendUsername: friendId // Assuming friendId is the actual ID of the user selected from search
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
      console.log('Friend request accepted:', response.data);
      // Remove the accepted request from the list
      setIncomingRequests(incomingRequests.filter(request => request.id !== friendId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

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
      <ul>
        {searchResults.map((user, index) => (
          <li key={index}>
            {user}
            <button onClick={() => handleAddFriend(user)}>Add Friend</button>
          </li>
        ))}
      </ul>
      <h2>Incoming Requests</h2>
      <ul>
        {incomingRequests.map((request, index) => (
          <li key={index}>
            {request.username}
            <button onClick={() => handleAcceptFriend(request.id)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddFriend;
