import React, {useRef, useEffect, useState } from 'react'
import {Link} from 'react-router-dom' 
import io from 'socket.io-client'
import './chat.css'

let socket;
const Chat = () => {
  const inRef=useRef()
    const [user, setUser] = useState("");
    const [room, setRoom] = useState("");
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const socketUrl = `${process.env.REACT_APP_URI}`

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const user = params.get('name');
        const room = params.get('room');

        setUser(user)
        setRoom(room)

        socket = io(socketUrl);



        socket.emit('join', { user, room }, (err) => {
            if (err) {
                // alert(err)
            }
        })

        return () => {
            // User leaves room
            socket.disconnect();

            socket.off()
        }

    }, [socketUrl,window.location.search])

    useEffect(() => {
        socket.on('message', msg => {
            setMessages(prevMsg => [...prevMsg, msg])

            setTimeout(() => {

                var div = document.getElementById("chat_body");
                div.scrollTop = div.scrollHeight - div.clientWidth;
            }, 10)
        })

        socket.on('roomMembers', usrs => {
            setUsers(usrs)
        })
    }, [])

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('sendMessage', message, () => setMessage(""))
        setTimeout(() => {
            var div = document.getElementById("chat_body");
            div.scrollTop = div.scrollHeight ;
        }, 100)
    }

    return (
   <div className="">
<div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark text-light">
    <h1>{room}</h1><t/><t/>
<Link to="/detail"><button className="btn btn-info">Admin details</button></Link>
  </nav>
</div>
<div className="row">
 <div className="col-sm col-md chat-window" id="chat_window_1 bg-dark" >

  <div className="col-xs-8 col-md-8 ">
     <div className="panel-body msg_container_base" id="chat_body">
                       {
                                messages.map((e, i) => (
                                    e.user === user?.toLowerCase() ? <>
   <div key={i} className="row msg_container base_receive rounded">
     <div className="col-xs-10 col-md ">
                 <div className="messages msg_receive rounded-top rounded-left bg-primary text-light">
                                
                    <p>{e.text}</p>
                                                    <time>{e.user}</time>
                                                </div>
                                            </div>
                                        </div>
                                    </> : <>
    <div key={i} className="row msg_container base_sent">
    <div className="col-xs-10 col-md">
      <div className="messages msg_sent rounded bg-secondary text-light">
                  <p>{e.text}</p>
                                                    <time>{e.user}</time>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))
                            }

                        </div>
                        <div className="panel-footer">
                            <div className="input-group">
      <input id="btn-input" type="text"
             value={message}   onKeyPress={e => e.key === 'Enter'? sendMessage(e) : null}
                                    onChange={(e) => setMessage(e.target.value)}
                ref={inRef}                className="input-sm chat_input form-control" placeholder="Write your message here..." />
                 <button className="btn btn-success" id="btn-msg"
                   onClick={(e) =>{sendMessage(e); inRef.current.focus()}}
                      
                      >send</button>       
                            </div>
                        </div>
                    </div>
                </div>
       <div className="bg-dark text-light col-sm col-md col-xs-4 col-md-4 form-control ac">
        <p>Active Users</p>
                <ul className=" Activeuser">
           {users.map((e, i) => (
      <li key={i}>{e.user}</li>
                            ))
                        }
                    </ul>
                </div>
                </div>
<center><h1>Backend site</h1>
                 <iframe src={socketUrl} ></iframe>
   </center>      
</div>
    )
}

export default Chat;