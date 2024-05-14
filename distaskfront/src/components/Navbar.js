//Navbar.js
import {React, useEffect,useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import LoginPage from "../pages/LoginPage";

 function Navbar() {

   const navigate = useNavigate();
  const [loggedin, setLoggedin] = useState(!!localStorage.getItem('token'));

  // Use useEffect to set up any side effects
  useEffect(() => {
    setLoggedin(!!localStorage.getItem('token'));
  }, [navigate]);

//logout button
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirect to the login page
    navigate('/LoginPage');
    //Navigate to="/loginpage";
  };


    return(
        <div>
        <nav>
        <Link to="/" className="title">DisTask</Link>
          <ul>  
            {loggedin && (<li><p>user: {localStorage.getItem('username')}</p></li>)}
            {loggedin && (<li><button onClick={handleLogout}>Logoout</button></li>)}
            <li><Link to="/About">About</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
          </ul>
        </nav>
        </div>
    )
 }

 export default Navbar;