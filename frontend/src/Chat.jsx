import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './chat.css';
import { Link } from 'react-router-dom';

const Chat = () => {
  const inRef = useRef();
  const chatEndRef = useRef();
  const socketRef = useRef();

  const [list, setList] = useState(false);
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const socketUrl = 'https://chat-backend-xq4g.onrender.com';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const roomName = params.get('room');

    setUser(name);
    setRoom(roomName);

    socketRef.current = io(socketUrl);
    socketRef.current.emit('join', { user: name, room: roomName });

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      setLoading(false);
    });

    socketRef.current.on('roomMembers', (usrs) => {
      setUsers(usrs);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit('sendMessage', message, () => setMessage(''));
      setLoading(true);
    }
  };

  const currentUser = user?.toLowerCase();

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <div className="header-content">
          <div className="room-info">
            <div className="room-avatar">
              <span>#</span>
            </div>
            <div>
              <h2 className="room-name">{room}</h2>
              <span className="online-count">{users.length} online</span>
            </div>
          </div>
          
          <div className="header-actions">
            <button
              className="users-toggle mobile-only"
              onClick={() => setList(!list)}
            >
              <i className="bi bi-people"></i>
            </button>
            <Link to="/detail" className="admin-btn">
              <i className="bi bi-info-circle"></i>
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="chat-main">
        {/* Users Sidebar */}
        <aside className={`users-sidebar ${list ? 'mobile-visible' : ''}`}>
          <div className="sidebar-header">
            <h3>Online Users</h3>
            <button className="close-sidebar mobile-only" onClick={() => setList(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="users-list">
            {users.map((u, i) => (
              <div key={i} className="user-item">
                <div className="user-avatar">
                  {u.user.charAt(0).toUpperCase()}
                </div>
                <span className="username">{u.user}</span>
                <div className="online-indicator"></div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <section className="chat-area">
          <div className="messages-container" id="chat_body">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-chat-dots"></i>
                <h3>No messages yet</h3>
                <p>Start the conversation by sending a message!</p>
              </div>
            ) : (
              messages.map((e, i) => (
                <div
                  key={i}
                  className={`message-wrapper ${e.user === currentUser ? 'own-message' : 'other-message'}`}
                >
                  <div className="message-bubble">
                    {e.user !== currentUser && (
                      <div className="message-sender">{e.user}</div>
                    )}
                    <div className="message-content">
                      <p>{e.text}</p>
                    </div>
                    <div className="message-time">
                      {formatTime(e.timestamp || Date.now())}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="message-form">
            <div className="input-container">
              <input
                ref={inRef}
                type="text"
                className="message-input"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
              />
              <button 
                className="send-button" 
                type="submit"
                disabled={!message.trim()}
              >
                <i className="bi bi-send"></i>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Chat;