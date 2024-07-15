const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
const connection = require('./components/db');
const loginController = require('./components/login');
const {NewTask,editingTask} = require('./components/NewTask');
const fetchAllTasks = require('./components/fetchAllTasks')
const completeTask = require('./components/completeTask')
const TaskAssigning = require('./components/TaskAssigning')
const calender = require('./components/calender')
const bodyParser = require('body-parser');

// //enable CORS
// const corsOptions = {
//   origin: ['http://localhost', 'http://localhost:3000'], // Allow requests from both http://localhost and http://localhost:3000
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
//   credentials: true // Allow credentials such as cookies
// };
// app.use(cors(corsOptions));

// Enable CORS for all origins
app.use(cors())

app.use(express.json());
app.use(bodyParser.json());

//app.use('/users', userRoutes);

//check connection to mysql
connection.connect((err) => {
  if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
}
  console.log('Connected to the database as ID ' + connection.threadId);
});                                                                                                                                                                                                            

app.get("/", (req, res) => res.send("Express on Vercel"));
// Route to handle data received from frontend
app.post('/login', loginController); 
app.post('/NewTask', NewTask);
app.post('/fetchAllTasks', fetchAllTasks)
app.post('/completeTask', completeTask)
app.post('/TaskAssigning', TaskAssigning)
app.post('/calender', calender)
app.post('/editingTask',editingTask)


//Helping Terence Route vvvvvvvv
const {searchUsers,addFriend, fetchfrienddata, acceptFriend, friendlist, declineFriend} = require('./components/Friends');
app.get('/searchUsers', searchUsers)
app.post('/addFriend', addFriend)
app.post('/fetchfrienddata', fetchfrienddata)
app.post('/acceptFriend', acceptFriend)
app.post('/friendlist', friendlist)
app.post('/declineFriend', declineFriend)


 


// CHatttttttttttttttttttttt      SOCKET.IO
const chat = require('./components/chat') ;
// const server = chat(app)



const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app)
const io = new Server(server, {
cors: {
    origin:"http://localhost:3000",
    methods:["GET", "POST"],
},
});

chat(io);


server.listen(PORT, ()=> {
  console.log(`chat server listening on ${PORT}`)
})


// // NEWWWWW CHATTTTTTTTTTTTTTTTTT
// const {chat, chat_sendmessage} = require('./components/chat') ;
// app.get('/events/:taskid', chat)
// app.post('/send_message', chat_sendmessage)


 







//app.listen(5000, ()=> {console.log("Server started on port 5000") })

 