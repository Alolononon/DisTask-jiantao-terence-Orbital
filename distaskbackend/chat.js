const express = require("express")
const app = express();
const http = require("http");
const {Server} = require("socket.io");
const connection = require('./db');

//const server = http.createServer(app)


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
