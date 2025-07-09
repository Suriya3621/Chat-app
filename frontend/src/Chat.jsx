import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './chat.css';
import { Link } from 'react-router-dom';

let socket;

const Chat = () => {
  const inRef = useRef();
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
    const user = params.get('name');
    const room = params.get('room');

    setUser(user);
    setRoom(room);

    socket = io(socketUrl);

    socket.emit('join', { user, room });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [socketUrl]);

  useEffect(() => {
    socket.on('message', msg => {
      setMessages(prev => [...prev, msg]);
      setLoading(false);

      setTimeout(() => {
        const div = document.getElementById("chat_body");
        div.scrollTop = div.scrollHeight;
      }, 10);
    });

    socket.on('roomMembers', usrs => {
      setUsers(usrs);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', message, () => setMessage(""));
      setLoading(true);
      setTimeout(() => {
        const div = document.getElementById("chat_body");
        div.scrollTop = div.scrollHeight;
      }, 100);
    }
  };

  return (
    <div className="container-fluid bg-light vh-100 d-flex flex-column">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 py-2">
        <span className="navbar-brand mb-0 h1">{room}</span>
        <div className="ms-auto d-flex align-items-center gap-3">
          <div className="form-check form-switch text-white">
            <label className="form-check-label" htmlFor="userToggle">Users</label>
            <input
              className="form-check-input"
              type="checkbox"
              id="userToggle"
              checked={list}
              onChange={() => setList(!list)}
            />
          </div>
          <Link to="/detail" className="btn btn-outline-info btn-sm">
            Admin Details
          </Link>
        </div>
      </nav>

      {/* Chat Window */}
      <div className="row flex-grow-1 overflow-hidden">
        <div className="col-12 col-md-9 d-flex flex-column px-0">
          <div
            id="chat_body"
            className="flex-grow-1 overflow-auto p-3 bg-white border-end"
            style={{ scrollBehavior: 'smooth' }}
          >
            {loading ? (
              <div className="d-flex justify-content-center align-items-center text-secondary">
                <div className="spinner-border me-2" role="status"></div>
                <span>Loading...</span>
              </div>
            ) : (
              messages.map((e, i) => (
                <div key={i} className={`d-flex mb-3 ${e.user === user?.toLowerCase() ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`p-2 rounded shadow-sm ${e.user === user?.toLowerCase() ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '70%' }}>
                    <p className="mb-1">{e.text}</p>
                    <small className="text-muted">{e.user}</small>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={sendMessage} className="bg-dark p-3 d-flex align-items-center">
            <input
              type="text"
              ref={inRef}
              className="form-control me-2 text-light bg-dark border-secondary"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
            />
            <button className="btn btn-success" type="submit">
              <i className="bi bi-send"></i>
            </button>
          </form>
        </div>

        {/* Active Users Sidebar */}
        {list && (
          <div className="col-12 col-md-3 bg-light border-start p-3">
            <h5 className="mb-3">Active Users</h5>
            <ul className="list-group">
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