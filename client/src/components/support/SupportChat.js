import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './SupportChat.css';

const SupportChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: "Really love your most recent photo. I've been trying to capture the same thing for a few months and would love some tips!" },
    { id: 2, sender: 'support', text: "A fast 50mm like f1.8 would help with the bokeh. I've been using primes as they tend to get a bit sharper images." },
    { id: 3, sender: 'user', text: "Thank you! That was very helpful!" },
  ]);

  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'user', text: input.trim() }]);
      setInput('');
    }
  };

  return (
    <Box className="support-chat-container">
      {/* Header */}
      <Box className="chat-header">
        <IconButton>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h6" className="chat-title">
          James
        </Typography>
      </Box>

      {/* Messages */}
      <Box className="chat-messages">
        {messages.map((message) => (
          <Box
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'support-message'}`}
          >
            <Avatar className="message-avatar">
              {message.sender === 'user' ? 'U' : 'S'}
            </Avatar>
            <Paper elevation={1} className="message-content">
              <Typography>{message.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Box className="chat-input-container">
        <TextField
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <IconButton className="send-button" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SupportChat;
