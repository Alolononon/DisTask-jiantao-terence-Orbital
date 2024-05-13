import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Testing from './pages/Testing';
import { useEffect } from 'react';




function App() {
  // const navigate = useNavigate();
  
  // useEffect(()=>{
  //   const token = localStorage.getItem('token');
  //   if (!token){
  //     navigate('/loginpage');
  //   }
  //   console.log(token);
  // },[navigate]);


  return (
    <div>      
      <Router>
        <Navbar/>


        <Routes>
          <Route exact path="/Testing" element={<Testing />} />
          <Route exact path="/LoginPage" element={<LoginPage />} />
          <Route exact path="/About" element={<About />} />
          <Route exact path="/Contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


