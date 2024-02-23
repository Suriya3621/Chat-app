import React,{useState} from "react";
import {Link} from 'react-router-dom'
import './login.css';
const Login = () => {
 const [name,setName]= useState('')
 const [room,setRoom]= useState('')
    return (
<div class="background">
  <form>
  <br/>
    <div class="box container text-light">
    <br/><p class="h2 text-light">Room Entree</p><br/>
      <input type="text" class="input " placeholder="Name"
      value={name}
      onChange={(e)=>setName(e.target.value)}
      /><br/><br/>
      <input type="text" name="" class="input"
      placeholder="Room code"
      value={room}
      onChange={(e)=>setRoom(e.target.value)}
      /><br/><br/>
          <Link onClick={(name === '' || room === '') ? (e) => e.preventDefault() : null}
      to={`/chat?name=${name}&room=${room}`}>
      <button type="submit" class="btn btn-light">Enter Room</button>
</Link>
<br/>
</div>
        </form>
      </div>
);
};

export default Login;
