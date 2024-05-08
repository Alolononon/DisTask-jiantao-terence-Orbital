import React, { useState } from 'react';


function Testing() {
  const [data, setData] = useState('');

  const sendDataToBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'value' }), // Your data object to send
      });
      const responseData = await response.json();
      console.log(responseData); // You can do something with the response from the backend
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={sendDataToBackend}>Send Data to Backend</button>
    </div>
  );
}

export default Testing;
