const express = require("express")
const app = express();
const http = require("http");
const {Server} = require("socket.io");
const connection = require('./db');


//const server = http.createServer(app)

// // In-memory store for tracking clients
// const clients = new Map();

// const chat = async (req, res) => {
//     const room = req.params.taskid;
//     console.log(room)

//     res.writeHead(200, {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache', 
//         'Connection': 'keep-alive'
//     });

//     // Add client to the room
//     if (!clients.has(room)) {
//         clients.set(room, []);
//     }
//     clients.get(room).push(res);
//     console.log(`Added client to room: ${room}, Total clients in room: ${clients.get(room).length}`);
    
//     connection.query('SELECT * FROM sakila.chatmessages WHERE Room = ? ORDER BY timestamp ASC', [room], (err, results) => {
//         if (err) {
//             console.error('Error fetching messages: ' + err.stack);
//             res.write(`event: error\ndata: ${JSON.stringify({ error: 'Error fetching messages' })}\n\n`);
//             return;
//         }    
//         //console.log(results)
//         res.write(`data: ${JSON.stringify(results)}\n\n`);
//         //console.log("done")
//     });    
    

//     const intervalId = setInterval(() => {
//         console.log("ping...")
//         res.write('data: ping\n\n');
//     }, 10000);

//     req.on('close', () => {
//         clearInterval(intervalId);
//         // Remove the client from the room
//         const clientArray = clients.get(room).filter(client => client !== res);
//         if (clientArray.length > 0) {
//             clients.set(room, clientArray);
//         } else {
//             clients.delete(room);
//         }
//         //console.log(`Client left room: ${room}, Remaining clients in room: ${clients.has(room) ? clients.get(room).length : 0}`);
//     });


// }

// const sendToAllClients = (room, message) => {
//     //console.log("run")
//     //console.log(`sending to Client room: ${room}, Remaining clients in room: ${clients.has(room) ? clients.get(room).length : 0}`);
//     //console.log(clients.has(room))
//     if (clients.has(room)) {
//         clients.get(room).forEach(client => {
//             //console.log('going each client')
//             client.write(`data: ${JSON.stringify(message)}\n\n`);
//         });
//     }
//     //console.log(`New message for room ${room}:`, message);
// }

// const chat_sendmessage = async (req, res) => {
//     const { message, room, author } = req.body;
//     //console.log(room)

//     //console.log(`11 sending to Client room: ${room}, Remaining clients in room: ${clients.has(room) ? clients.get(room).length : 0}`);

//     connection.query('INSERT INTO sakila.chatmessages (Room, Author, Message) VALUES (?, ?, ?)', [room, author, message], (err, results) => {
//         if (err) {
//             console.error('Error inserting message:', err.stack);
//             res.status(500).send('Error inserting message');
//             return;
//         }
//         const newMessage = { id: results.insertId, Room: room, Author: author, Message: message, created_at: new Date() };
//         //console.log("start")
//         //console.log(newMessage)
//         sendToAllClients(JSON.stringify(room), newMessage);
//         res.status(200).send('Message sent');
//     });
// }


// module.exports = {chat, chat_sendmessage};









// socket.IO method (not in use)
const chat = (app) => {
    // CHATTTTTTTTTTT
    const server = http.createServer(app)
    const io = new Server(server, {
    cors: {
        origin:"http://localhost:3000",
        methods:["GET", "POST"],
    },
    });
    io.on("connection", (socket)=> {
        //console.log(`user Connected: ${socket.id}`);
        socket.on("join_room", (data)=> {
            socket.join(data)
            console.log("loaded messages from database")

             connection.query("SELECT * FROM chatmessages WHERE room = ? ORDER BY timestamp ASC", [data], (error,results)=> {
                 if (error) {
                    console.error("Unable to retrieve messages from database: ", error);
                    return;
                }
                socket.emit("load_messages", results);
            })
        })

        //when message sent from someone
        socket.on("send_message", (data) => {
            const {room, author, message} = data;
            connection.query("INSERT INTO chatmessages (room, author, message) VALUE (?,?,?) ", [room, author, message], (err,result) => {
                if(err) {
                    console.error("unable to save new messages: ", err)
                    return;
                }
                const newTaskid = result.insertId;
                connection.query("SELECT * FROM chatmessages WHERE id = ? ",newTaskid, (err, result)=>{
                    if (err) throw err;
                    io.in(data.room).emit("receive_message", result[0])
                })
            })
            console.log("message sent")
        })
    })
    return server;
}

module.exports = chat;