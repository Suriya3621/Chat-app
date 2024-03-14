import React from 'react'
import {Link} from 'react-router-dom'
import './Admin.css'
function Admin(){
  return(
      <center class="con"> 

  <div class="detail">
  <p>Admin name:Suriyaprakash</p>
  <hr/>
  <p>Email:suriyaprakashraja849@gmail.com</p>
  </div><br/><br/><br/>
    <Link to='/'><button class="btn btn-danger">Click here to login page</button></Link>
  </center>
    )
}
export default Admin;