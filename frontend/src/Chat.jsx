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

  return (
    <div className="vh-100 d-flex flex-column bg-white">
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark px-3 py-2">
        <div className="d-flex justify-content-between align-items-center w-100">
          <span className="navbar-brand h4 m-0">{room}</span>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-light btn-sm d-md-none"
              onClick={() => setList(!list)}
            >
              {list ? 'Hide' : 'Users'}
            </button>
            <Link to="/detail" className="btn btn-outline-info btn-sm d-none d-md-block">
              Admin Details
            </Link>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-grow-1 d-flex overflow-hidden position-relative">
        {/* Users Sidebar (desktop) */}
        <div className={`bg-light border-end p-3 d-none d-md-block`} style={{ width: '250px' }}>
          <h6 className="text-secondary mb-3">Online Users</h6>
          <ul className="list-group list-group-flush">
            {users.map((u, i) => (
              <li key={i} className="list-group-item">{u.user}</li>
            ))}
          </ul>
        </div>

        {/* Users Popup (mobile) */}
        {list && (
          <div
            className="position-absolute top-0 start-0 bg-white border-end p-3 shadow"
            style={{
              width: '70%',
              height: '100%',
              zIndex: 999,
            }}
          >
            <div className="d-flex justify-content-between mb-2">
              <h6 className="text-secondary">Online Users</h6>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setList(false)}>✕</button>
            </div>
            <ul className="list-group list-group-flush">
              {users.map((u, i) => (
                <li key={i} className="list-group-item">{u.user}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Chat View */}
        <div className="flex-grow-1 d-flex flex-column">
          <div
            id="chat_body"
            className="flex-grow-1 p-3 overflow-auto"
            style={{ background: '#f0f2f5' }}
          >
            {loading ? (
              <div className="text-center text-secondary mt-5">
                <div className="spinner-border" role="status"></div>
                <p className="mt-2">Loading chat...</p>
              </div>
            ) : (
              messages.map((e, i) => (
                <div
                  key={i}
                  className={`d-flex mb-3 ${e.user === currentUser ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`p-3 rounded-3 shadow-sm ${e.user === currentUser ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                    style={{ maxWidth: '75%' }}
                  >
                    <p className="mb-1">{e.text}</p>
                    <small className="text-muted">{e.user}</small>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="p-2 border-top bg-white d-flex align-items-center"
          >
            <input
              ref={inRef}
              type="text"
              className="form-control me-2"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
            />
            <button className="btn btn-success" type="submit">
              <i className="bi bi-send" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;