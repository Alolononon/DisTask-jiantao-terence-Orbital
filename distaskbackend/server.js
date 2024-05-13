const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const connection = require('./db');
const jwt=require('jsonwebtoken');
const secretKey = '794613';
const app = express();

//enable CORS
const corsOptions = {
  origin: ['http://localhost', 'http://localhost:3000'], // Allow requests from both http://localhost and http://localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true // Allow credentials such as cookies
};
app.use(cors(corsOptions));

app.use(express.json());

//check connection to mysql
connection.connect((err) => {
  if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
}
  console.log('Connected to the database as ID ' + connection.threadId);
});                                                                                                                                                                                                            

  
// Route to handle data received from frontend
app.post('/api', (req, res) => {
  // retriving the data received from the frontend
  const receivedData = req.body;
  console.log('Data received from frontend:', receivedData);
  const { username, password, confirmPassword, isLogin } = receivedData;

  // checking username and password received from frontend
  const checkQuery = 'SELECT * FROM accounts WHERE username = ?';
  connection.query(checkQuery, [username], (err, results)=> {
    if(err) {
      console.error('Error checking username:', err);
      return res.status(500).send('Internet Server Error');
    }

    //SIGNING UP
    if(!isLogin){
      //if username exists
      if (results.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      //inserting username and password into database:accounts AND logging in
      if(results.length==0){
        const query = 'INSERT INTO sakila.accounts (username, password) VALUES (?, ?)';
        const values = [username, password];
        
        connection.query(query, values, (error, results, fields) => {
          if (error) {
            console.error('Error inserting account:', error);
            res.status(500).json({ error: 'Error inserting account' });
            return;
          }
          //logging in=================================
          res.json({ message: 'Account inserted successfully' });

        }); 
      }
    } else { 
    // LOGINING IN
      const query = 'SELECT * FROM sakila.accounts WHERE username = ? AND password = ?';
      connection.query(query, [username, password], (err, results)=> {
        if (results.length === 1) {
          // User found, login successful==================================
          const receivedresults = results.body;
          console.log("Login successful with user: "+ results[0].username);
          const token = jwt.sign({username},secretKey,{expiresIn:'1h'});
          return res.json({token});

          //return res.status(200).json({ message: 'Login successful', user: results[0] });
        } else {
          // User not found or password are incorrect
          console.log("User not found or password are incorrect");
          return res.status(401).json({ error: 'User not found or password are incorrect' })
        }
      })
    }
  })

}); 
 

















app.listen(5000, ()=> {console.log("Server started on port 5000") })

