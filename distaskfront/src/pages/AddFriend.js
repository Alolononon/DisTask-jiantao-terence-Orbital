

import React, { useState } from 'react';

function AddUser() {
  const [username, setUsername] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleAddUser = (event) => {
    event.preventDefault();
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User added:', data);
        setUsername('');
      })
      .catch((error) => {
        console.error('Error adding user:', error);
      });
  };

  return (
    <div>
      <h1>Add a New User</h1>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter username"
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default AddUser;
