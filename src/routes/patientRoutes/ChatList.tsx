// ChatList.tsx
import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import '../../styles/patientDashboard/chatList.scss'
import ChatWindow from '../../components/patientComponents/chat/ChatWindow';


interface Chat {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  lastMessage: string;
  lastMessageDate: string;
  sentByMe: boolean;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Dr. John Doe',
    specialization: 'Orthodontist',
    imageUrl: '/path/to/medic1.jpg',
    lastMessage: 'I’ll check the report today.',
    lastMessageDate: 'Oct 28, 2024',
    sentByMe: true,
  },
  {
    id: '2',
    name: 'Dr. Jane Smith',
    specialization: 'Periodontist',
    imageUrl: '/path/to/medic2.jpg',
    lastMessage: 'When is the next appointment?',
    lastMessageDate: 'Oct 27, 2024',
    sentByMe: false,
  },
  // Add more mock data as needed
];

const ChatList: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null); // Go back to chat list
  };

  return (
    <div className="chat-list-container">
      {selectedChat ? (
        <ChatWindow
          chat={selectedChat}
          onBack={handleBackToList} // Function to return to the chat list
        />
      ) : (
        <div className="chat-list">
          <h2>Chats</h2>
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              className="chat-card"
              onClick={() => handleChatSelect(chat)}
            >
              <Avatar src={chat.imageUrl} alt={chat.name} className="medic-avatar" />
              <div className="chat-details">
                <div className="medic-info">
                  <span className="medic-name">{chat.name}</span>
                  <span className="medic-specialization">{chat.specialization}</span>
                </div>
                <div className="message-info">
                  <span className="last-message">
                    {chat.lastMessage}{' '}
                    {chat.sentByMe && <CheckIcon fontSize="small" className="check-icon" />}
                  </span>
                  <span className="message-date">{chat.lastMessageDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;