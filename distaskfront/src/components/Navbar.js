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

  const getsettings = (value) => {
    //const value = event.target.value; // Get the selected value, which is a string
    switch (value) {
      case "Profile": // Check if the value is "Profile"
        navigate('/Profile'); // Navigate to the Profile page
        break;
      case "Logout": // Check if the value is "Logout"
        handleLogout(); // Call the logout function
        break;
      case "Friends": // Check if the value is "Friends"
        navigate('/Friends'); // Navigate to the Friends page
        break;
      case "AddFriend":
        navigate('/AddFriend');
        break;
      case "Contact":
        navigate('/Contact');
        break;
      case "About":
        navigate('/About')
        break;
      default:
        console.log('Invalid option');
    }
  };

    return(
      <div>
        <nav>
          {loggedin ? (
            <>
            <Link to="/" className="title">DisTask</Link>


            <ul>
              <li><p className="username">{sessionStorage.getItem('username')}</p></li>
              <li><button onClick={handleLogout} className="logoutButton">Logout</button></li>
              <li className="dropdown">
                  <img src="/settings.png" alt="Settings" className="settings-icon" />
                  <div className="dropdown-content">
                    <a href="#!" onClick={() => getsettings("Profile")}>Profile</a>
                    <a href="#!" onClick={() => getsettings("Friends")}>Friends</a>
                    <a href="#!" onClick={() => getsettings("AddFriend")}>Add Friends</a>
                    <a href="#!" onClick={() => getsettings("Contact")}>Contact</a>
                    <a href="#!" onClick={() => getsettings("About")}>About</a>
                    {/* <a href="#!" onClick={() => getsettings("Logout")}>Logout</a> DOESN'T WORK AS OF YET*/} 
                  </div>
              </li>
            </ul>
            </>
          ) :
          (
            <>
            <Link to="/" className="title">DisTask</Link>
            <ul>
              <li><Link to="/About">About</Link></li>
              <li><Link to="/Contact">Contact</Link></li>
              <li><Link to="/LoginPage">Login</Link></li>
              </ul>
            </>
          )
          }
        </nav>
      </div>
    )

    //old code here for reference can delete later
    // return(
    //     <div>
    //     <nav>
    //     <Link to="/" className="title">DisTask</Link>
    //       <ul>  
    //         {loggedin && (<li><p>user: {sessionStorage.getItem('username')}</p></li>)}
    //         {loggedin && (<li><button onClick={handleLogout}>Logoout</button></li>)}
    //         <li><Link to="/Contact">Contact</Link></li>
    //         <li><Link to="/About">About</Link></li>
    //       </ul>
    //     </nav>
    //     </div>
    // )
 }

 export default Navbar;