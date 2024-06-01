const express = require('express');
const cors = require('cors');
const connection = require('./db');
const app = express();
const loginController = require('./login');
const NewTask = require('./NewTask');
const fetchAllTasks = require('./fetchAllTasks')
const completeTask = require('./completeTask')


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
app.post('/login', loginController); 
 
app.post('/NewTask', NewTask);
app.post('/fetchAllTasks', fetchAllTasks)

app.post('/completeTask', completeTask)










 




app.listen(5000, ()=> {console.log("Server started on port 5000") })

