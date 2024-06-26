
import React, { useState, useEffect } from 'react';
import axios from 'axios'; //some popular js library i found that is needed :O

const Friends = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend
    axios.get('http://localhost:5000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  return (
    <div>
      <h1>Friends List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
