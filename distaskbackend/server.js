const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const connection = require('./db');

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


connection.connect((err) => {
  if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
}
  console.log('Connected to the database as ID ' + connection.threadId);
});                                                                                                                                                                                                            

  
// Route to handle data received from frontend
app.post('/api', (req, res) => {
  // Handle the data received from the frontend
  const receivedData = req.body;
  console.log('Data received from frontend:', receivedData);

  const { username, password } = receivedData;

  // Perform the MySQL query to insert data into the database
  const query = 'INSERT INTO sakila.accounts (username, password) VALUES (?, ?)';
  const values = [username, password];
  
  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting account:', error);
      res.status(500).json({ error: 'Error inserting account' });
      return;
    }
    
    // Send a response back to the frontend
    res.json({ message: 'Account inserted successfully' });
  }); 

}); 















// Route to insert username and password into database
// app.post('/accounts', (req, res) => {
//   // Extract username and password from request body
//   const { username, password } = req.body;

//   // Perform the MySQL query to insert data into the database
//   const query = 'INSERT INTO accounts (username, password) VALUES (?, ?)';
//   const values = [username, password];
  
//   console.log("here")
//   pool.query(query, values, (error, results, fields) => {
//     if (error) {
//       console.error('Error inserting account:', error);
//       res.status(500).json({ error: 'Error inserting account' });
//       return;
//     }
//     res.json({ message: 'Account inserted successfully' });
//   });
// });





app.listen(5000, ()=> {console.log("Server started on port 5000") })

