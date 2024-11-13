import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Avatar, IconButton, TextField, Button, Menu, MenuItem, Box } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EventIcon from '@mui/icons-material/Event';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import '../../styles/chatWindow.scss';
import { ArrowBack } from '@mui/icons-material';
import RequestAppointment from '../request/RequestAppointment';

interface Appointment {
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'canceled';
}

interface Message {
  id: string;
  sender: 'me' | 'other';
  content: string;
  type: 'text' | 'file' | 'appointmentRequest';
  timestamp: string;
  appointment?: Appointment;
}

interface ChatWindowProps {
  chat: {
    id: string;
    name: string;
    specialization: string;
    imageUrl: string;
  };
  onBack: () => void;
  shouldUsePortal?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onBack, shouldUsePortal = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [requestAppointmentOpen, setRequestAppointmentOpen] = useState(false);

  const defaultAppointment: Appointment = {
    date: '2023-11-10',
    time: '10:00',
    status: 'pending',
  };

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

  const handleEventIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRequestAppointmentExit = () => {
    setRequestAppointmentOpen(false);
  };

  const renderAppointmentStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <HourglassEmptyIcon color="warning" />;
      case 'canceled':
        return <CancelIcon color="error" />;
      default:
        return null;
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

        {/* Centered Appointment Request Card */}
        <Box className="appointment-request-card" display="flex" flexDirection="column" alignItems="center">
          <h4>Appointment Request</h4>
          <p>{`Date: ${defaultAppointment.date}`}</p>
          <p>{`Time: ${defaultAppointment.time}`}</p>
          <div className="status">
            {renderAppointmentStatusIcon(defaultAppointment.status)}
            <span className="status-text">{defaultAppointment.status}</span>
          </div>
        </Box>

        {/* Message List */}
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === 'me' ? 'my-message' : 'their-message'}`}>
              <span className="message-content">{msg.content}</span>
              <span className="message-timestamp">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="message-input">
          <IconButton onClick={handleEventIconClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => setRequestAppointmentOpen(true)}>
              <EventIcon /> Request Appointment
            </MenuItem>
            <MenuItem>
              <AttachFileIcon /> Attach File
            </MenuItem>
            <MenuItem>
              <CameraAltIcon /> Camera
            </MenuItem>
          </Menu>
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

      {/* Fullscreen Overlay for RequestAppointment */}
      {requestAppointmentOpen && (
        <div className="fullscreen-overlay">
          <div className="modal-content">
            <RequestAppointment onExit={handleRequestAppointmentExit} />
          </div>
        </div>
      )}
    </div>
  );

  return shouldUsePortal
    ? ReactDOM.createPortal(chatWindowContent, document.body)
    : chatWindowContent;
};

export default ChatWindow;
