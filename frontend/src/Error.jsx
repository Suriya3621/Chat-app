import React from 'react'
import {Link} from 'react-router-dom'
import './Error.css'
function Error(){
  return(
      <center class="container">
  <p class="text-muted error">404 </p>
    <p class="h4 oops">Oops.. your url is wrong </p>
    <Link to='/'><button class="btn btn-danger">Click here to go login page</button></Link>
    <br/><br/>
   <Link to='/detail'> <button class="btn btn-info">Click here to visit Admin details</button></Link>
    </center>
    )
}
export default Error;