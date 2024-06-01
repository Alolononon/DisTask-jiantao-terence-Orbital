import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Testing from './pages/Testing';
import { useEffect } from 'react';
import PrivateRoute from './components/PrivateRoute';
import TodoList from './pages/TodoList';


function App() {

  

  return (
    <div>      
      <Router>
        <Navbar/>
        <Routes>
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute component={TodoList} />} />
        <Route path="/about" element={<PrivateRoute component={About} />} />
        <Route path="/contact" element={<PrivateRoute component={Contact} />} />
          {/* <Route exact path="/Testing" element={<Testing />} />
          <Route exact path="/About" element={<About />} />
          <Route exact path="/Contact" element={<Contact />} /> */}
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;


