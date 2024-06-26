const express = require('express');
const app = express();
const cors = require('cors');

const connection = require('./db');
const loginController = require('./login');
const NewTask = require('./NewTask');
const fetchAllTasks = require('./fetchAllTasks')
const completeTask = require('./completeTask')
const TaskAssigning = require('./TaskAssigning')


// //enable CORS
// const corsOptions = {
//   origin: ['http://localhost', 'http://localhost:3000'], // Allow requests from both http://localhost and http://localhost:3000
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
//   credentials: true // Allow credentials such as cookies
// };
// app.use(cors(corsOptions));

app.use(cors())

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
app.post('/TaskAssigning', TaskAssigning)



// CHatttttttttttttttttttttt
const chat = require('./chat') ;
const server = chat(app)

server.listen(5000, ()=> {
  console.log("chat server listening on 5000")
})









 




// app.listen(5000, ()=> {console.log("Server started on port 5000") })

