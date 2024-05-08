const express = require('express')
const app = express()


//-------------req=request res=response --------------------

// app.get("/api", (req,res)=> {
//     res.json({ "users": ["userOne", "userTwo", "userThree", "userfour"] })
// })


const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost', 'http://localhost:3000'], // Allow requests from both http://localhost and http://localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true // Allow credentials such as cookies
};
app.use(cors(corsOptions));

app.use(express.json());

app.post('/api', (req, res) => {
  // Handle the data received from the frontend
  const receivedData = req.body;
  console.log('Data received from frontend:', receivedData);

  // Send a response back to the frontend
  res.json({ message: 'Data received successfully' });
});



app.listen(5000, ()=> {console.log("Server started on port 5000") })

