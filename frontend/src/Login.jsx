import React,{useState} from "react";
import {Link} from 'react-router-dom'
import './login.css';
const Login = () => {
 const [name,setName]= useState('')
 const [room,setRoom]= useState('')
    return (
  <div class="container ">
    <div class="circleyo"></div>
    <div class="login-container">
      <h2 class="mb-4 text-center">Join the room</h2><br/><br/>
      <form>
        <div class="mb-3 input">
          <input type="text" id="username" class="username-input text-dark" required 
          value={name}
          onChange={(e)=>setName(e.target.value)}
          />
          <label for="username">Username</label>
        </div><br/>
        <div class="mb-3 input">
          <input type="text" id="room-code" class="room-code-input" required 
          value={room}
          onChange={(e)=>setRoom(e.target.value)}
          />
          <label for="room-code">Room code</label>
        </div>
        <div class="d-grid">
          <Link onClick={(name === '' || room === '') ? (e) => e.preventDefault() : null}
      to={`/chat?name=${name}&room=${room}`}>
          <button class="btn btn-primary btn-block form-control">Join</button>
          </Link>
        </div>
          
      </form>
              <div class="circlegy">
    </div>
  </div>
</div>
);
};

export default Login;
