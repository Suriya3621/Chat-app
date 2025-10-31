import React from 'react';
import { Link } from 'react-router-dom';
import "./Error.css";
function Error() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <div className="mb-8">
          <span className="text-9xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Animated Text */}
        <div className="mb-8">
          <p className="text-2xl font-semibold text-gray-800 mb-2">
            Oops... your URL is wrong
          </p>
          <div className="w-64 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto rounded-full animate-pulse"></div>
        </div>

        {/* Buttons */}
        <div className="space-y-4 mb-8">
          <Link to="/">
            <button className="w-full max-w-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              Click here to go to login page
            </button>
          </Link>
          
          <a href="https://suriyaprakash2009.netlify.app">
            <button className="w-full max-w-xs bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              Click here to visit Admin details
            </button>
          </a>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Error;