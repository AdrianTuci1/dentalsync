import React, { useState } from 'react';
import '../styles/components/chat.scss'; // Import CSS for custom styling


// TypeScript interfaces for user and message data
interface User {
  id: number;
  name: string;
}

interface Message {
  from: string;
  text: string;
}

// Demo data for users and messages
const users: User[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
];

const messages: Record<number, Message[]> = {
  1: [{ from: 'John Doe', text: 'Hello!' }, { from: 'You', text: 'Hi, John!' }],
  2: [{ from: 'Jane Smith', text: 'Hey, how are you?' }, { from: 'You', text: 'Doing good, thanks!' }],
  3: [{ from: 'Alice Johnson', text: 'Good morning!' }, { from: 'You', text: 'Good morning, Alice!' }],
};

const ChatComponent: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const isSmallScreen = window.innerWidth <= 800;

  const handleUserClick = (userId: number) => {
    setSelectedUser(userId);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  return (
    <div className="chat-container">
      {/* User List Column */}
      {(isSmallScreen && selectedUser === null) || !isSmallScreen ? (
        <div className="user-list">
          {users.map((user) => (
            <div
              key={user.id}
              className="user-item"
              onClick={() => handleUserClick(user.id)}
            >
              {user.name}
            </div>
          ))}
        </div>
      ) : null}

      {/* Chat Column */}
      {(isSmallScreen && selectedUser !== null) || !isSmallScreen ? (
        <div className="chat-window">
          {isSmallScreen && (
            <button className="back-button" onClick={handleBackClick}>
              Back
            </button>
          )}

          {selectedUser !== null ? (
            <div>
              <h2>{users.find((user) => user.id === selectedUser)?.name}</h2>
              {messages[selectedUser]?.map((msg, idx) => (
                <p key={idx}>
                  <strong>{msg.from}: </strong>
                  {msg.text}
                </p>
              ))}
            </div>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ChatComponent;
