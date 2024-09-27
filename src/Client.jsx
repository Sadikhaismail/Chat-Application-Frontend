import React, { useEffect, useState } from 'react';
import './Client.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function Client() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [room, setRoom] = useState("");

    useEffect(() => {
        socket.on("message-receive", (msg) => {
            setMessages((prev) => [...prev, { text: msg, sender: 'receiver' }]);
        });
        
        return () => {
            socket.off("message-receive");
        };
    }, []);

    function handleSendMessage(e) {
        e.preventDefault();
        const message = { text: input, sender: 'sender' }; 
        setMessages((prev) => [...prev, message]);
        socket.emit("chat message", input, room);
        setInput("");
    }

    const joinroom = (e) => {
        e.preventDefault();
        if (room) {
            socket.emit("joinroom", room);
        }
    };

    return (
        <div>
            <h1 className='heading'>Chat Application</h1>

            <div className='maindiv'>
                <div className='msgdiv'>
                    {messages.map((msg, index) => (
                        <p key={index} className={`paragragh ${msg.sender}`}>
                            {msg.text}
                        </p>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className='form'>
                    <input
                    placeholder='Enter your message'
                        type="text"
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        className='input'
                    />
                    <button className='button'>Send</button>
                </form>

                <form onSubmit={joinroom} className='joinnowform'>
                    <input
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        placeholder='Enter room number'
                        className='joinnowinput'
                    />
                    <button className='joinnow button'>Join Now</button>
                </form>
            </div>
        </div>
    );
}

export default Client;
