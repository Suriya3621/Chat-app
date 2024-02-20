import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Login from "./Login";
import Chat from './Chat';
import Error from './Error';
import Admin from './Admin';

const router = createBrowserRouter([
{path="/" element=<Login />},
{path="/chat" element=<Chat />},
{path="/detail" element=<Admin />},
{path="*" element=<Error />}
])

function App() {

 return (<RouterProvider router={router}/>  )                              
 }

                                                           export default App;
