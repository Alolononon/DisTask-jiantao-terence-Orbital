//Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

 function Navbar() {
    return(
        <div>
        <nav>
        <Link to="/" className="title">DisTask</Link>
          <ul>          
            <li><Link to="/About">About</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
          </ul>
        </nav>
        </div>
    )
 }

 export default Navbar;