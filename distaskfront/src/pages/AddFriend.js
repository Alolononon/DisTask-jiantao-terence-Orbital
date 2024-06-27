

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

import React, { useState } from 'react';
import axios from 'axios';

function AddFriend() {
  const [friendUsername, setFriendUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleUsernameChange = async (event) => {
    const username = event.target.value;
    setFriendUsername(username);

    if (username.trim() !== '') {
      try {
        const response = await axios.get(`http://localhost:5000/searchUsers?username=${username}`);
        setSearchResults(response.data);
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
        const response = await axios.get(`http://localhost:5000/searchUsers?username=${friendUsername}`);
        setSearchResults(response.data);
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
        userId: sessionStorage.getItem('token'), // Replace with actual logged-in user ID
        friendUsername: friendId // Assuming friendId is the actual ID of the user selected from search
      });
      console.log('Friend added:', response.data);
      setFriendUsername('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

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
        {searchResults.map((user) => (
          <li key={user.id}>
            {user.username}
            <button onClick={() => handleAddFriend(user.id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddFriend;
