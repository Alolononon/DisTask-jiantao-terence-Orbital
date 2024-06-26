import { useEffect, useState, useRef} from "react"
import "./Popout.css"
import "./ChatPopout.css"
import io from 'socket.io-client'

const socket = io.connect("http://localhost:5000")


function ChatPopout ({onClose, taskid, username}) {
    const [message,setMessage] = useState("")
    const [messageReceived, setMessageReceived] = useState([])



    const SendMessage = () => {
        if(message.trim()){
            console.log("sending")
            socket.emit("send_message", {message, room: taskid, author: username}) 
            setMessage("") //delete the input after sent


            //scroll down when sending button
            if (chatboxRef.current) {
                chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
            }


        }
    }


    // everytime theres message sent from other people, socket will trigger to run this vvvvv
    useEffect(()=> {

        //initial loading of messages
        socket.emit("join_room", taskid);
        socket.on("load_messages", (data)=> {
             setMessageReceived(data)
        } )
        
        //when receiving new message
        socket.on("receive_message", (newMessage) => {
            setMessageReceived(prevMessages => [...prevMessages, newMessage]);
        });


        // Clean up socket listeners when component unmounts
        return () => {
            socket.off("load_messages");
            socket.off("receive_message");
        };

    },[socket])


    //scrolling down the chatbox when open chatbox and every new message
    const isScrolledToBottom = useRef(true);
    const chatboxRef = useRef(null)
    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, []);
    // Scroll to the bottom when messages change if user is at the bottom
    useEffect(() => {
        if (chatboxRef.current && isScrolledToBottom.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [messageReceived]);

    // Track scroll position to determine if the user is at the bottom
    const handleScroll = () => {
        if (chatboxRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatboxRef.current;
            isScrolledToBottom.current = scrollTop + clientHeight >= scrollHeight - 1;
            //console.log(`scrollTop: ${scrollTop}, scrollHeight: ${scrollHeight}, clientHeight: ${clientHeight}, isScrolledToBottom: ${isScrolledToBottom.current}`);
        }
    };


    

    return(
        <div className="popout">

            {/* top layer */}
            <div className="top-layer">
                <p className="wording" >Chat</p>
                <button onClick={onClose} >Close</button>
            </div>

            {/* Chattttt */}

            <div className="chatbox" ref={chatboxRef} onScroll={handleScroll}>
                {messageReceived.map((msg) => (
                    <div key={msg.id}>
                        <strong>{msg.Author}: </strong>{msg.Message}
                    </div>
                ))}

            </div>

            <div>

                <input  
                    className="sendMessageInput"
                    placeholder="send message" 
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    onKeyDown={ (e) => {
                        if(e.key === 'Enter') {
                            SendMessage()
                        }
                    }}
                />
                <button onClick={SendMessage} className="sendChatbutton">Send</button>
            </div>
            

        </div>
    )
}

export default ChatPopout;