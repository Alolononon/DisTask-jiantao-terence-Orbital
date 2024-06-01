// App.js
import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [pwnotmatch, setpwnotmatch] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [wrongLogin, setwrongLogin] = useState(false);


  // useEffect(()=>{
  //   const token = localStorage.getItem('token');
  //   if (!token){
  //     navigate('/LoginPage');
  //   }
  //   console.log('token:' + token);
  // },[navigate]);



  useEffect(()=> {
    setpwnotmatch(password!==confirmPassword);
  },[password,confirmPassword])

  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( data ), // Your data object to send
      });
      const responseData = await response.json();
      console.log(responseData); 
      
      if(response.ok){
        //login or sign up is successful===================================
        console.log("login successfull");
        const token = responseData.token;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('username', username);
        navigate("/");
      }
      //if username exists
      else if(response.status === 400 && responseData.error === 'Username already exists') {
        setAccountExists(true);
      }else if(response.status === 401 && responseData.error === 'User not found or password are incorrect') {
        setAccountExists(false);
        setwrongLogin(true);
      }
    
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
    setAccountExists(false);
    setwrongLogin(false);
    setpwnotmatch(false);
  }









  return (

    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          {
            accountExists && (
              <p style={{ pointerEvents: 'none' }}>
                Username already exists! Try again!
              </p>
            )}
            {
            wrongLogin && (
              <p style={{ pointerEvents: 'none' }}>
                Wrong password or Account not exists!
              </p>
            )}
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
          {
            !isLogin  && pwnotmatch && (
              <p style={{ pointerEvents: 'none' }}>
                Confirm password not match!
              </p>
            )}
          <button type="submit" disabled={!isLogin && pwnotmatch}>{isLogin ? 'Login' : 'Sign Up'}</button>
          <p onClick={() => {
            setIsLogin(!isLogin);
            clearallstate();
            }}>
            {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Login'}
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
