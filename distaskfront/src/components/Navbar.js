//Navbar.js
import {React, useEffect,useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

 function Navbar() {

   const navigate = useNavigate();
  const [loggedin, setLoggedin] = useState(!!sessionStorage.getItem('token'));

  // Use useEffect to set up any side effects
  useEffect(() => {
    setLoggedin(!!sessionStorage.getItem('token'));
  }, [navigate]);

//logout button
  const handleLogout = () => {
    // Remove the token from localStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    // Redirect to the login page
    navigate('/LoginPage');
    //Navigate to="/loginpage";
  };


    return(
        <div>
        <nav>
        <Link to="/" className="title">DisTask</Link>
          <ul>  
            {loggedin && (<li><p>user: {sessionStorage.getItem('username')}</p></li>)}
            {loggedin && (<li><button onClick={handleLogout}>Logoout</button></li>)}
            <li><Link to="/Contact">Contact</Link></li>
            <li><Link to="/About">About</Link></li>
          </ul>
        </nav>
        </div>
    )
 }

 export default Navbar;