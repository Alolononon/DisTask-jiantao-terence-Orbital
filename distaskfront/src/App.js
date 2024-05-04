import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>

      <header>
        <h1>
          DisTask
        </h1>
        <p>
          Welcome to DisTask, where u can manage ur task, chat with ur teamates,
          and also plan with ur teamates. 
          <br/>
          This website is under maintenance, please 
          do not mess around
        </p>
      </header>
    </div>
  );
}

export default App;
