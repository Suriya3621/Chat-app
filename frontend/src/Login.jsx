import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Join the Room
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials to start chatting
            </p>
          </div>

          <form className="space-y-6">
            {/* Username Input */}
            <div className="relative group">
              <input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 peer"
                placeholder="Username"
                required
              />
              <label
                htmlFor="username"
                className="absolute left-4 top-3 text-gray-400 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-focus:top-[-10px] peer-focus:text-purple-400 peer-focus:text-sm peer-placeholder-shown:text-base peer-focus:bg-gray-800 peer-focus:px-2 peer-placeholder-shown:bg-transparent"
              >
                Username
              </label>
            </div>

            {/* Room Code Input */}
            <div className="relative group">
              <input
                type="text"
                id="room-code"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 peer"
                placeholder="Room code"
                required
              />
              <label
                htmlFor="room-code"
                className="absolute left-4 top-3 text-gray-400 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-focus:top-[-10px] peer-focus:text-blue-400 peer-focus:text-sm peer-placeholder-shown:text-base peer-focus:bg-gray-800 peer-focus:px-2 peer-placeholder-shown:bg-transparent"
              >
                Room Code
              </label>
            </div>

            {/* Join Button */}
            <div className="pt-4">
              <Link
                onClick={(name === '' || room === '') ? (e) => e.preventDefault() : null}
                to={`/chat?name=${name}&room=${room}`}
              >
                <button
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
                    name && room 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!name || !room}
                >
                  {name && room ? 'Join Room 🚀' : 'Enter Credentials'}
                </button>
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Secure • User Friendly • Real-time
            </p>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Login;