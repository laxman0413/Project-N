import React, { useState, useEffect, useRef } from 'react';
import './Chat.css'; // Assuming you have a CSS file for styling

const Chat = ({ seekerId, providerId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        // Replace 'localhost:3001' with your backend server's address if it's different
        ws.current = new WebSocket('ws://localhost:3001');

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, newMessage]);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup on component unmount
        return () => {
            ws.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            const message = {
                Seeker_id: seekerId,
                Provider_id: providerId,
                MessageText: input
            };
            ws.current.send(JSON.stringify(message));
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <span>{msg.MessageText}</span>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    placeholder="Type a message..." 
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
