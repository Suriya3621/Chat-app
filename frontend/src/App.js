import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Chat from './Chat';
import Error from './Error';
import Admin from './Admin';
function App() {
    return (
         <div>
            <Routes>                                                                       <Route path="/" element={<Login />} />
                                                  <Route path="*" element={<Error />} />
                                                     <Route path="/detail" element={<Admin />}/>
                                                    <Route path="/chat" element={<Chat />} />
                                                                 </Routes>
                                                                                                                                        </div>
                                       );
                                       }

                                                                 export default App;
