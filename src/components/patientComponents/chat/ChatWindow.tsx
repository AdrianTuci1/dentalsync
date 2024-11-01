// ChatWindow.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Avatar, IconButton, TextField, Button } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EventIcon from '@mui/icons-material/Event';
import SendIcon from '@mui/icons-material/Send';
import '../../../styles/patientDashboard/chatWindow.scss';
import { ArrowBack } from '@mui/icons-material';

interface Message {
    id: string;
    sender: 'me' | 'other';
    content: string;
    type: 'text' | 'file' | 'appointmentRequest';
    timestamp: string;
  }
  
  interface ChatWindowProps {
    chat: {
      id: string;
      name: string;
      specialization: string;
      imageUrl: string;
    };
    onBack: () => void;
  }
  
  const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState<string>('');
  
    const handleSendMessage = () => {
      if (messageInput.trim()) {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: 'me',
          content: messageInput,
          type: 'text',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMessage]);
        setMessageInput('');
      }
    };
  
    const chatWindowContent = (
      <div className="chat-window-overlay">
        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <IconButton onClick={onBack}>
              <ArrowBack />
            </IconButton>
            <Avatar src={chat.imageUrl} alt={chat.name} className="medic-avatar" />
            <div className="medic-details">
              <h3>{chat.name}</h3>
              <span>{chat.specialization}</span>
            </div>
          </div>
  
          {/* Message List */}
          <div className="message-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === 'me' ? 'my-message' : 'their-message'}`}
              >
                <span className="message-content">{msg.content}</span>
                <span className="message-timestamp">{msg.timestamp}</span>
              </div>
            ))}
          </div>
  
          {/* Message Input */}
          <div className="message-input">
            <IconButton>
              <AttachFileIcon />
            </IconButton>
            <IconButton>
              <CameraAltIcon />
            </IconButton>
            <IconButton>
              <EventIcon />
            </IconButton>
            <TextField
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              fullWidth
              variant="outlined"
              size="small"
            />
            <Button onClick={handleSendMessage} color="primary" variant="contained">
              <SendIcon />
            </Button>
          </div>
        </div>
      </div>
    );
  
    return ReactDOM.createPortal(chatWindowContent, document.body);
  };
  
  export default ChatWindow;