import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

const Chat = () => {
  const inRef = useRef();
  const chatEndRef = useRef();
  const socketRef = useRef();
  const messagesContainerRef = useRef();

  const [list, setList] = useState(false);
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const socketUrl = process.env.REACT_APP_URI;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const roomName = params.get('room');

    setUser(name);
    setRoom(roomName);

    socketRef.current = io(socketUrl);
    socketRef.current.emit('join', { user: name, room: roomName });

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off();
    };
  }, [socketUrl]);

  useEffect(() => {
    socketRef.current.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      setLoading(false);
    });

    socketRef.current.on('roomMembers', (usrs) => {
      setUsers(usrs);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const scrollTop = messagesContainerRef.current.scrollTop;
        setIsScrolled(scrollTop > 50);
      }
    };

    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit('sendMessage', message, () => setMessage(''));
      setMessage('');
      setLoading(true);
    }
  };

  const currentUser = user?.toLowerCase();

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 font-sans">
      {/* Sticky Header */}
      <header className={`bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow">
              #
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{room}</h2>
              <span className="text-green-500 text-sm font-semibold flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {users.length} online
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="w-11 h-11 bg-indigo-50 hover:bg-indigo-500 text-indigo-500 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => setList(!list)}
              title="Online Users"
            >
              <i className="bi bi-people-fill"></i>
              <span className="sm:hidden ml-1">{users.length}</span>
            </button>

            <button
              className="w-11 h-11 bg-indigo-50 hover:bg-indigo-500 text-indigo-500 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => setShowAdminInfo(!showAdminInfo)}
              title="Room Info"
            >
              <i className="bi bi-info-circle"></i>
            </button>

            <button 
              className="w-11 h-11 bg-indigo-50 hover:bg-indigo-500 text-indigo-500 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              onClick={scrollToBottom}
              title="Scroll to bottom"
            >
              <i className="bi bi-arrow-down"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Info Panel */}
      {showAdminInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-slide-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Room Information</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowAdminInfo(false)}
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <i className="bi bi-person text-indigo-500"></i>
                <span>Your Name: <strong>{user}</strong></span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <i className="bi bi-hash text-indigo-500"></i>
                <span>Room: <strong>{room}</strong></span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <i className="bi bi-people text-indigo-500"></i>
                <span>Online Users: <strong>{users.length}</strong></span>
              </div>
              <Link 
                to="/detail" 
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <i className="bi bi-gear"></i>
                <span>Admin Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 pb-24 lg:pb-6">
        {/* Users Sidebar */}
        <aside className={`bg-white/95 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg flex flex-col lg:w-80 ${
          list ? 'fixed inset-4 lg:static lg:inset-auto z-40' : 'hidden lg:flex'
        }`}>
          <div className="p-4 lg:p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-3 text-gray-900">
              <i className="bi bi-people-fill text-indigo-500 text-lg"></i>
              <h3 className="font-semibold">Online Users ({users.length})</h3>
            </div>
            <button 
              className="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              onClick={() => setList(false)}
            >
              <i className="bi bi-x-lg text-lg"></i>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {users.map((u, i) => (
              <div 
                key={i} 
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 mb-2 ${
                  u.user === user 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500' 
                    : 'hover:bg-gray-50 hover:translate-x-1'
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow">
                  {u.user.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 text-gray-900 font-medium">
                  {u.user} {u.user === user && '(You)'}
                </span>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm shadow-green-200"></div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button 
              className="w-full p-3 bg-indigo-50 hover:bg-indigo-500 text-indigo-500 hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => setShowAdminInfo(true)}
            >
              <i className="bi bi-info-circle"></i>
              <span>Room Info</span>
            </button>
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 bg-white/95 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg flex flex-col min-h-[500px]">
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-4 lg:p-6"
          >
            {loading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="text-6xl text-gray-300 mb-4">
                  <i className="bi bi-chat-dots"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {room}!</h3>
                <p className="text-gray-500 mb-6">Start the conversation by sending the first message</p>
                <button 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center space-x-2"
                  onClick={() => inRef.current?.focus()}
                >
                  <i className="bi bi-chat"></i>
                  <span>Start Chatting</span>
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center mb-4 flex items-center justify-center space-x-2 animate-pulse">
                  <i className="bi bi-arrow-down"></i>
                  <span>Scroll down for new messages</span>
                </div>
                {messages.map((e, i) => (
                  <div
                    key={i}
                    className={`flex mb-5 animate-slide-up ${
                      e.user === currentUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`max-w-[70%] lg:max-w-[60%] p-4 rounded-2xl shadow ${
                      e.user === currentUser 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md' 
                        : 'bg-white border border-gray-200 rounded-bl-md'
                    }`}>
                      {e.user !== currentUser && (
                        <div className={`font-semibold text-sm mb-1 ${
                          e.user === currentUser ? 'text-indigo-100' : 'text-indigo-500'
                        }`}>
                          {e.user}
                        </div>
                      )}
                      <div className="mb-2">
                        <p className="leading-relaxed">{e.text}</p>
                      </div>
                      <div className={`text-xs ${
                        e.user === currentUser ? 'text-indigo-100' : 'text-gray-400'
                      } text-right`}>
                        {formatTime(e.timestamp || Date.now())}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            <div ref={chatEndRef} className="h-px" />
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-4 lg:p-6 border-t border-gray-200 bg-white sticky bottom-0">
            <div className="flex space-x-3 items-end max-w-full">
              <button 
                type="button"
                className="w-11 h-11 bg-gray-100 hover:bg-indigo-500 text-gray-500 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0"
                title="Attach file"
              >
                <i className="bi bi-plus-lg"></i>
              </button>
              <input
                ref={inRef}
                type="text"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none min-h-[44px] max-h-32"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
              />
              <button 
                className="w-14 h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex-shrink-0"
                type="submit"
                disabled={!message.trim()}
                title="Send message"
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <span className="text-xs text-gray-400">
                {message.length}/500
              </span>
            </div>
          </form>
        </section>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 flex justify-around p-3 h-16 z-40">
        <button 
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all flex-1 max-w-20 ${
            list ? 'text-indigo-500 bg-indigo-50' : 'text-gray-500'
          }`}
          onClick={() => setList(!list)}
        >
          <i className="bi bi-people text-lg"></i>
          <span className="text-xs">Users</span>
        </button>
        <button 
          className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-all text-gray-500 hover:text-indigo-500 flex-1 max-w-20"
          onClick={scrollToBottom}
        >
          <i className="bi bi-arrow-down text-lg"></i>
          <span className="text-xs">Bottom</span>
        </button>
        <button 
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all flex-1 max-w-20 ${
            showAdminInfo ? 'text-indigo-500 bg-indigo-50' : 'text-gray-500'
          }`}
          onClick={() => setShowAdminInfo(!showAdminInfo)}
        >
          <i className="bi bi-info-circle text-lg"></i>
          <span className="text-xs">Info</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Chat;