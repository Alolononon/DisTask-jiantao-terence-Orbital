// App.js
import React, { useEffect, useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);


  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( data ), // Your data object to send
      });
      const responseData = await response.json();
      console.log(responseData); // You can do something with the response from the backend
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
      isLogin: isLogin
    };
        
    if (isLogin) {
      // Handle login
      sendDataToBackend(data);

      console.log('Logging in with:', username, password);
    } else {
      // Handle sign up
      sendDataToBackend(data);
      console.log('Signing up with:', username, password, confirmPassword);
    }
  };

  const clearallstate = () => {
    setConfirmPassword("");
  }




  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])




  return (

    

    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          <p onClick={() => {
            setIsLogin(!isLogin);
            clearallstate();
            }}>
            {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Login'}
          </p>
        </form>
      </div>

      <div>
        {(typeof backendData.users === 'undefined') ? (
          <p>Loading..</p>
        ) : (
          backendData.users.map((user, i) => (
            <p key={i}>{user}</p>
          ))
        )}
      </div>

    </div>
  );
}

export default LoginPage;
