import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import { useEffect } from 'react';
import PrivateRoute from './components/PrivateRoute';
import TodoList from './pages/TodoList';
import Friends from './pages/Friends';
import AddFriend from './pages/AddFriend';
import CalendarPage from './pages/Calendar';
import ProfilePage from './pages/ProfilePage';
function App() {


  useEffect(() => {
      document.title = 'DisTask';
    }, []);

  return (
    <div>      
      <Router>
        <Navbar/>
        <Routes>
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute component={TodoList} />} />
        <Route path="/about" element={< About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/friends" element={<PrivateRoute component={Friends}/>}/>
        <Route path="/addfriend" element={<PrivateRoute component={AddFriend}/>}/>
        <Route path="/calendar" element={<PrivateRoute component={CalendarPage}/> }/>
        <Route path="/profile" element={<PrivateRoute component={ProfilePage}/> }/>
          {/* <Route exact path="/Testing" element={<Testing />} />
          <Route exact path="/About" element={<About />} />
          <Route exact path="/Contact" element={<Contact />} /> */}
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;





// for json package
// "homepage": "https://alolononon.github.io",
// "name": "distaskfront",
// "version": "0.1.0",
// "proxy": "https://distask-backend.vercel.app",
// "private": true,