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
  const [loading, setLoading] = useState(true); // Add loading state

  const socketUrl = 'https://chat-backend-xq4g.onrender.com';

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const user = params.get('name');
    const room = params.get('room');

    setUser(user);
    setRoom(room);

    socket = io(socketUrl);

    socket.emit('join', { user, room }, (err) => {
      if (err) {
        // alert(err)
      }
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [socketUrl, window.location.search]);

  useEffect(() => {
    socket.on('message', msg => {
      setMessages(prevMsg => [...prevMsg, msg]);
      setLoading(false); // Set loading to false when messages are received
      setTimeout(() => {
        var div = document.getElementById("chat_body");
        div.scrollTop = div.scrollHeight - div.clientWidth;
      }, 10);
    });

    socket.on('roomMembers', usrs => {
      setUsers(usrs);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") { // Check if the message is not empty or only contains whitespace
      socket.emit('sendMessage', message, () => setMessage(""));
      setLoading(true); // Set loading to true when sending message
      setTimeout(() => {
        var div = document.getElementById("chat_body");
        div.scrollTop = div.scrollHeight;
      }, 100);
    }
  };

  return (
     <div>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light text-dark">
          <h1>{room}</h1><t/><t/>
   <div class="form-check form-switch">    
          View active users<input 
       class="form-check-input"
        role="switch" id="flexSwitchCheckChecked"
  type="checkbox" 
  checked={list} 
  onChange={() => setList(prevList => !prevList)} // Toggle the value of 'list'
/>  </div>
            <Link to="/detail">
            <button className="btn btn-info">Admin details</button>
          </Link>
        </nav>
      </div>
      <div className="bg-secondary line" >
      </div>
      <div className="row">
        <div className="col-md chat-window" id="chat_window_1 ">

          <div className="">
            <div className="panel-body msg_container_base chatwin" id="chat_body">
              {loading ? (
                // Render spinner while loading
                
    <div className="d-flex justify-content-center text-light spin">
      <div className="spinner-border" role="status"></div>
      <span className="sr-only">Loading...</span>
    </div>
              ) : (
                messages.map((e, i) => (
                  e.user === user?.toLowerCase() ? <>
                    <div key={i} className="row msg_container base_receive rounded">
                      <div className="col-md">
                        <div className="messages msg_receive rounded-top rounded-left bg-primary text-light">
                          <p>{e.text}</p>
                          <time>{e.user}</time>
                        </div>
                      </div>
                    </div>
                  </> : <>
                    <div key={i} className="row msg_container base_sent">
                      <div className="col-md">
                        <div className="messages msg_sent rounded bg-light text-dark">
                          <p>{e.text}</p>
                          <time>{e.user}</time>
                        </div>
                      </div>
                    </div>
                  </>
                ))
              )}
<br/>
<br/>
<br/>
            </div>
            
              <div className="input-box">
                <input
                  id="btn-input"
                  type="text"
                  value={message}
                  onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
                  onChange={(e) => setMessage(e.target.value)}
                  ref={inRef}
                  className="chat_input text-light "
                  placeholder="Message here..."
                
                />
                <div className="input-group-append">
                  <button
                    className="text-success"
                    id="btn-msg"
                    onClick={(e) => { sendMessage(e); inRef.current.focus() }}
                  >
                    <i class="bi bi-send"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
       {list ?(<center>
        <div className="alert alert-light text-dark alert-dismissable  ac" 
        role="alert"
        >
        
          <h4>Active Users</h4>
          <ul className="Activeuser">
            {users.map((e, i) => (
              <li key={i}>{e.user}</li>
            ))}
          </ul>
        </div>
        </center>
       ):null}
      </div>
    
  );
};

export default Chat;