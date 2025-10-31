import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './chat.css';
import { Link } from 'react-router-dom';

const Chat = () => {
  const inRef = useRef();
  const chatEndRef = useRef();
  const socketRef = useRef();
  const messagesContainerRef = useRef();

  const [list, setList] = useState(false);
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const socketUrl = process.env.REACT_APP_URI;

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
  }, [socketUrl]);

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

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const scrollTop = messagesContainerRef.current.scrollTop;
        setIsScrolled(scrollTop > 50);
      }
    };

    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit('sendMessage', message, () => setMessage(''));
      setMessage('');
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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-container">
      {/* Sticky Header */}
      <header className={`chat-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="room-info">
            <div className="room-avatar">
              <span>#</span>
            </div>
            <div className="room-details">
              <h2 className="room-name">{room}</h2>
              <span className="online-count">{users.length} online</span>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="header-btn users-toggle"
              onClick={() => setList(!list)}
              title="Online Users"
            >
              <i className="bi bi-people-fill"></i>
              <span className="mobile-only">{users.length}</span>
            </button>
            
            <button
              className="header-btn info-toggle"
              onClick={() => setShowAdminInfo(!showAdminInfo)}
              title="Room Info"
            >
              <i className="bi bi-info-circle"></i>
            </button>

            <button 
              className="header-btn scroll-bottom"
              onClick={scrollToBottom}
              title="Scroll to bottom"
            >
              <i className="bi bi-arrow-down"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Info Panel */}
      {showAdminInfo && (
        <div className="admin-info-panel">
          <div className="admin-info-content">
            <div className="admin-header">
              <h3>Room Information</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAdminInfo(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="admin-details">
              <div className="info-item">
                <i className="bi bi-person"></i>
                <span>Your Name: <strong>{user}</strong></span>
              </div>
              <div className="info-item">
                <i className="bi bi-hash"></i>
                <span>Room: <strong>{room}</strong></span>
              </div>
              <div className="info-item">
                <i className="bi bi-people"></i>
                <span>Online Users: <strong>{users.length}</strong></span>
              </div>
              <Link to="/detail" className="admin-detail-link">
                <i className="bi bi-gear"></i>
                Admin Settings
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="chat-main">
        {/* Users Sidebar */}
        <aside className={`users-sidebar ${list ? 'mobile-visible' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <i className="bi bi-people-fill"></i>
              <h3>Online Users ({users.length})</h3>
            </div>
            <button className="close-sidebar" onClick={() => setList(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="users-list">
            {users.map((u, i) => (
              <div key={i} className={`user-item ${u.user === user ? 'current-user' : ''}`}>
                <div className="user-avatar">
                  {u.user.charAt(0).toUpperCase()}
                </div>
                <span className="username">
                  {u.user} {u.user === user && '(You)'}
                </span>
                <div className="online-indicator"></div>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <button 
              className="sidebar-action-btn"
              onClick={() => setShowAdminInfo(true)}
            >
              <i className="bi bi-info-circle"></i>
              Room Info
            </button>
          </div>
        </aside>

        {/* Chat Area */}
        <section className="chat-area">
          <div 
            className="messages-container" 
            id="chat_body"
            ref={messagesContainerRef}
          >
            {loading && messages.length === 0 ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="bi bi-chat-dots"></i>
                </div>
                <h3>Welcome to {room}!</h3>
                <p>Start the conversation by sending the first message</p>
                <button 
                  className="start-chat-btn"
                  onClick={() => inRef.current?.focus()}
                >
                  <i className="bi bi-chat"></i>
                  Start Chatting
                </button>
              </div>
            ) : (
              <>
                <div className="welcome-banner">
                  <i className="bi bi-arrow-down"></i>
                  <span>Scroll down for new messages</span>
                </div>
                {messages.map((e, i) => (
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
                ))}
              </>
            )}
            <div ref={chatEndRef} className="chat-anchor" />
          </div>

          {/* Sticky Message Input */}
          <form onSubmit={sendMessage} className="message-form">
            <div className="input-container">
              <button 
                type="button"
                className="attach-btn"
                title="Attach file"
              >
                <i className="bi bi-plus-lg"></i>
              </button>
              <input
                ref={inRef}
                type="text"
                className="message-input"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
              />
              <button 
                className="send-button" 
                type="submit"
                disabled={!message.trim()}
                title="Send message"
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
            <div className="input-actions">
              <span className="char-count">
                {message.length}/500
              </span>
            </div>
          </form>
        </section>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <button 
          className={`nav-btn ${list ? 'active' : ''}`}
          onClick={() => setList(!list)}
        >
          <i className="bi bi-people"></i>
          <span>Users</span>
        </button>
        <button 
          className="nav-btn"
          onClick={scrollToBottom}
        >
          <i className="bi bi-arrow-down"></i>
          <span>Bottom</span>
        </button>
        <button 
          className={`nav-btn ${showAdminInfo ? 'active' : ''}`}
          onClick={() => setShowAdminInfo(!showAdminInfo)}
        >
          <i className="bi bi-info-circle"></i>
          <span>Info</span>
        </button>
      </div>
    </div>
  );
};

export default Chat;