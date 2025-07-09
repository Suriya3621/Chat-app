import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './chat.css';
import { Link } from 'react-router-dom';

const Chat = () => {
  const inRef = useRef();
  const chatEndRef = useRef();
  const socketRef = useRef();

  const [list, setList] = useState(false);
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const socketUrl = 'https://chat-backend-xq4g.onrender.com';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('name');
    const r = params.get('room');

    const currentUser = u?.trim();
    setUser(currentUser);
    setRoom(r);

    socketRef.current = io(socketUrl);
    socketRef.current.emit('join', { user: currentUser, room: r });

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
      socketRef.current.emit('sendMessage', message, () => setMessage(""));
      setLoading(true);
    }
  };

  const currentUser = user?.toLowerCase();

  return (
    <div className="vh-100 d-flex flex-column bg-white">
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark px-4 py-3 sticky-top shadow">
        <div className="d-flex w-100 justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h4 text-uppercase">{room}</span>
          <div className="d-flex gap-3 align-items-center">
            <div className="form-check form-switch text-white">
              <label className="form-check-label me-2" htmlFor="userToggle">Users</label>
              <input
                className="form-check-input"
                type="checkbox"
                id="userToggle"
                checked={list}
                onChange={() => setList(!list)}
              />
            </div>
            <Link to="/detail" className="btn btn-sm btn-outline-info">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-grow-1 d-flex overflow-hidden">
        <div className="flex-grow-1 d-flex flex-column">
          <div
            id="chat_body"
            className="flex-grow-1 p-4 overflow-auto"
            style={{ background: "#f8f9fa" }}
          >
            {loading ? (
              <div className="text-center text-secondary">
                <div className="spinner-border" role="status"></div>
                <p className="mt-2">Loading chat...</p>
              </div>
            ) : (
              messages.map((e, i) => (
                <div key={i} className={`d-flex mb-3 ${e.user === currentUser ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`p-3 rounded-3 shadow-sm ${e.user === currentUser ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '75%' }}>
                    <p className="mb-1">{e.text}</p>
                    <small className="text-muted">{e.user}</small>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-top bg-light d-flex">
            <input
              ref={inRef}
              type="text"
              className="form-control me-2"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
            />
            <button type="submit" className="btn btn-success">
              <i className="bi bi-send"></i>
            </button>
          </form>
        </div>

        {/* User Sidebar */}
        {list && (
          <div className="d-none d-md-block border-start p-3 bg-white" style={{ width: '250px' }}>
            <h6 className="mb-3 text-secondary">Active Users</h6>
            <ul className="list-group list-group-flush">
              {users.map((e, i) => (
                <li key={i} className="list-group-item">{e.user}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;