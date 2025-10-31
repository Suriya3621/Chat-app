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
  const [isConnected, setIsConnected] = useState(true);

  const socketUrl = process.env.REACT_APP_URI;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const roomName = params.get('room');

    setUser(name);  
    setRoom(roomName);  

    if (!name || !roomName) {  
      console.error('Missing name or room parameters');  
      return;  
    }  

    try {  
      socketRef.current = io(socketUrl, {  
        transports: ['websocket', 'polling']  
      });  

      socketRef.current.emit('join', { user: name, room: roomName });  

      socketRef.current.on('connect', () => {  
        setIsConnected(true);  
      });  

      socketRef.current.on('disconnect', () => {  
        setIsConnected(false);  
      });  

      socketRef.current.on('connect_error', () => {  
        setIsConnected(false);  
      });  

    } catch (error) {  
      console.error('Socket initialization error:', error);  
      setIsConnected(false);  
    }  

    return () => {  
      if (socketRef.current) {  
        socketRef.current.disconnect();  
        socketRef.current.off();  
      }  
    };
  }, [socketUrl]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleMessage = (msg) => {  
      const messageWithTimestamp = {  
        ...msg,  
        timestamp: msg.timestamp || Date.now(),  
        id: Date.now() + Math.random()
      };  
      setMessages((prev) => [...prev, messageWithTimestamp]);  
      setLoading(false);  
    };  

    const handleRoomMembers = (usrs) => {  
      setUsers(usrs);  
    };  

    socketRef.current.on('message', handleMessage);  
    socketRef.current.on('roomMembers', handleRoomMembers);  

    return () => {  
      socketRef.current.off('message', handleMessage);  
      socketRef.current.off('roomMembers', handleRoomMembers);  
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socketRef.current) {
      socketRef.current.emit('sendMessage', message, (error) => {
        if (error) {
          console.error('Error sending message:', error);
        } else {
          setMessage('');
        }
      });
    }
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getRandomColor = (str) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
      'from-cyan-500 to-cyan-600'
    ];
    const index = str ? str.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Sample messages for demo
  const sampleMessages = [
    {
      id: 1,
      user: 'John',
      text: 'Hey everyone! Welcome to the chat! 👋',
      timestamp: Date.now() - 3600000
    },
    {
      id: 2,
      user: 'Sarah',
      text: 'Thanks for having me! This looks great!',
      timestamp: Date.now() - 3500000
    },
    {
      id: 3,
      user: user,
      text: 'Glad you guys like it! Feel free to explore the features.',
      timestamp: Date.now() - 3400000
    }
  ];

  const displayMessages = messages.length > 0 ? messages : sampleMessages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex">
      {/* Connection Status */}
      {!isConnected && (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 backdrop-blur-sm text-xs">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">Connection lost. Reconnecting...</span>
          </div>
        </div>
      )}

      {/* Sidebar */}  
      <div className={`fixed lg:relative inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 z-40 ${  
        list ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'  
      }`}>  
        {/* Compact Sidebar Header */}  
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">  
          <div className="flex items-center justify-between">  
            <div className="flex items-center space-x-3">  
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">  
                <span className="text-white font-bold text-sm">💬</span>  
              </div>  
              <div>  
                <h1 className="text-white font-bold text-sm">ChatApp</h1>  
                <p className="text-blue-100 text-xs">Real-time messaging</p>  
              </div>  
            </div>  
            <button   
              onClick={() => setList(false)}  
              className="lg:hidden p-1 hover:bg-white/20 rounded-lg transition-colors"  
            >  
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />  
              </svg>  
            </button>  
          </div>  
        </div>  

        {/* Compact Room Info */}  
        <div className="p-4 border-b border-gray-700">  
          <div className="flex items-center space-x-3">  
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">  
              <span className="text-white font-bold text-sm">#</span>  
            </div>  
            <div className="flex-1 min-w-0">  
              <h2 className="font-bold text-white text-sm truncate">{room}</h2>  
              <p className="text-green-400 text-xs font-medium flex items-center">  
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>  
                {users.length || 5} online  
              </p>  
            </div>  
          </div>  
        </div>  

        {/* Compact Online Users */}  
        <div className="flex-1 overflow-hidden flex flex-col">  
          <div className="p-4">  
            <h3 className="font-semibold text-gray-300 text-sm mb-3 flex items-center">  
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />  
              </svg>  
              Online Users  
            </h3>  
          </div>  

          <div className="flex-1 overflow-y-auto px-4 pb-4">  
            <div className="space-y-2">  
              {(users.length > 0 ? users : [  
                { user: 'John' },  
                { user: 'Sarah' },  
                { user: 'Mike' },  
                { user: 'Emma' },  
                { user: user }  
              ]).map((u, index) => (  
                <div   
                  key={index}  
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${  
                    u.user === user   
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30'   
                      : 'hover:bg-gray-700/50 border border-transparent'  
                  }`}  
                >  
                  <div className="relative flex-shrink-0">  
                    <div className={`w-8 h-8 bg-gradient-to-br ${getRandomColor(u.user)} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}>  
                      {getInitials(u.user)}  
                    </div>  
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border border-gray-800 rounded-full shadow-lg"></div>  
                  </div>  
                  <div className="flex-1 min-w-0">  
                    <p className="font-semibold text-white text-sm truncate flex items-center">  
                      {u.user}  
                      {u.user === user && (  
                        <span className="ml-1 px-1.5 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium border border-blue-400/30">  
                          You  
                        </span>  
                      )}  
                    </p>  
                    <p className="text-gray-400 text-xs">Active</p>  
                  </div>  
                </div>  
              ))}  
            </div>  
          </div>  
        </div>  

        {/* Compact Sidebar Footer */}  
        <div className="p-4 border-t border-gray-700">  
          <button   
            onClick={() => setShowAdminInfo(true)}  
            className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-200 border border-gray-600 text-sm"  
          >  
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />  
            </svg>  
            <span className="font-semibold text-gray-200">Room Info</span>  
          </button>  
        </div>  
      </div>  

      {/* Main Chat Area */}  
      <div className="flex-1 flex flex-col min-w-0 bg-gray-900">  
        {/* Compact Mobile Header */}  
        <header className="lg:hidden bg-gray-800 border-b border-gray-700 sticky top-0 z-30">  
          <div className="flex items-center justify-between p-3">  
            <button   
              onClick={() => setList(true)}  
              className="p-2 hover:bg-gray-700 rounded-xl transition-colors"  
            >  
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />  
              </svg>  
            </button>  

            <div className="flex items-center space-x-2">  
              <div className="text-center">  
                <h1 className="font-bold text-white text-sm">{room}</h1>  
                <p className="text-green-400 text-xs font-medium">{users.length || 5} online</p>  
              </div>  
            </div>  

            <button   
              onClick={() => setShowAdminInfo(true)}  
              className="p-2 hover:bg-gray-700 rounded-xl transition-colors"  
            >  
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />  
              </svg>  
            </button>  
          </div>  
        </header>  

        {/* Messages Container */}  
        <div   
          ref={messagesContainerRef}  
          className="flex-1 overflow-y-auto bg-gray-900"  
        >  
          {loading && messages.length === 0 ? (  
            <div className="flex items-center justify-center h-full">  
              <div className="text-center">  
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>  
                <p className="text-gray-400 font-medium text-sm">Loading messages...</p>  
              </div>  
            </div>  
          ) : (  
            <div className="max-w-4xl mx-auto p-4 space-y-4">  
              {/* Welcome Message */}  
              <div className="text-center py-6">  
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 px-4 py-3 rounded-xl text-xs font-medium backdrop-blur-sm">  
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />  
                  </svg>  
                  <span>Welcome to #{room}! Start chatting below</span>  
                </div>  
              </div>  

              {/* Messages */}  
              {displayMessages.map((msg) => (  
                <div  
                  key={msg.id}  
                  className={`flex ${msg.user === user ? 'justify-end' : 'justify-start'}`}  
                >  
                  <div className={`max-w-[85%] lg:max-w-[75%] flex ${msg.user === user ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>  
                    {/* Avatar */}  
                    <div className={`flex-shrink-0 ${msg.user === user ? 'order-2' : 'order-1'}`}>  
                      <div className={`w-8 h-8 bg-gradient-to-br ${getRandomColor(msg.user)} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}>  
                        {getInitials(msg.user)}  
                      </div>  
                    </div>  

                    {/* Message Content */}  
                    <div className={`flex flex-col ${msg.user === user ? 'items-end order-1' : 'items-start order-2'} space-y-1 flex-1`}>  
                      {/* Sender Name & Time */}  
                      <div className={`flex items-center space-x-2 ${msg.user === user ? 'flex-row-reverse space-x-reverse' : ''}`}>  
                        <span className="text-gray-300 font-semibold text-xs">  
                          {msg.user === user ? 'You' : msg.user}  
                        </span>  
                        <span className="text-gray-500 text-xs">  
                          {formatTime(msg.timestamp)}  
                        </span>  
                      </div>  

                      {/* Message Bubble */}  
                      <div className={`rounded-xl px-3 py-2 shadow-lg ${  
                        msg.user === user   
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'   
                          : 'bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700'  
                      }`}>  
                        <p className="leading-relaxed whitespace-pre-wrap break-words text-sm">{msg.text}</p>  
                      </div>  
                    </div>  
                  </div>  
                </div>  
              ))}  
            </div>  
          )}  
          <div ref={chatEndRef} className="h-4" />  
        </div>  

        {/* Instagram-style Message Input */}  
        <div className="bg-gray-800 border-t border-gray-700 p-4 sticky bottom-0">  
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto">  
            <div className="flex space-x-3 items-center">  
              <div className="flex-1">  
                <div className="relative">  
                  <input  
                    ref={inRef}  
                    type="text"  
                    value={message}  
                    onChange={(e) => setMessage(e.target.value)}  
                    placeholder="Message..."  
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-white placeholder-gray-400 text-sm"  
                    onKeyDown={(e) => {  
                      if (e.key === 'Enter' && !e.shiftKey) {  
                        e.preventDefault();  
                        sendMessage(e);  
                      }  
                    }}  
                    maxLength={500}  
                  />  
                  {message.length > 0 && (  
                    <div className="absolute bottom-1.5 right-3">  
                      <span className="text-gray-400 text-xs bg-gray-600 px-1.5 py-0.5 rounded">  
                        {message.length}/500  
                      </span>  
                    </div>  
                  )}  
                </div>  
              </div>  
              <button  
                type="submit"  
                disabled={!message.trim() || !isConnected}  
                className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none flex items-center justify-center"  
              >  
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />  
                </svg>  
              </button>  
            </div>  
            <div className="flex justify-between items-center mt-2">  
              <span className="text-gray-400 text-xs">  
                {isConnected ? '🟢 Connected' : '🔴 Connecting...'}  
              </span>  
              <span className="text-gray-500 text-xs">  
                Press Enter to send  
              </span>  
            </div>  
          </form>  
        </div>  
      </div>  

      {/* Admin Info Modal */}  
      {showAdminInfo && (  
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">  
          <div className="bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-700">  
            <div className="flex items-center justify-between mb-6">  
              <h3 className="text-xl font-bold text-white">Room Information</h3>  
              <button   
                onClick={() => setShowAdminInfo(false)}  
                className="p-2 hover:bg-gray-700 rounded-xl transition-colors"  
              >  
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />  
                </svg>  
              </button>  
            </div>  

            <div className="space-y-3">  
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-xl border border-gray-600">  
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-400/30">  
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />  
                  </svg>  
                </div>  
                <div>  
                  <p className="text-xs text-gray-400 font-medium">Your Name</p>  
                  <p className="font-bold text-white text-sm">{user}</p>  
                </div>  
              </div>  

              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-xl border border-gray-600">  
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-400/30">  
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />  
                  </svg>  
                </div>  
                <div>  
                  <p className="text-xs text-gray-400 font-medium">Room Name</p>  
                  <p className="font-bold text-white text-sm">{room}</p>  
                </div>  
              </div>  

              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-xl border border-gray-600">  
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-400/30">  
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />  
                  </svg>  
                </div>  
                <div>  
                  <p className="text-xs text-gray-400 font-medium">Online Members</p>  
                  <p className="font-bold text-white text-sm">{users.length || 5} active users</p>  
                </div>  
              </div>  

              <Link   
                to="/detail"  
                className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-center py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl mt-4 text-sm"  
              >  
                Manage Room Settings  
              </Link>  
            </div>  
          </div>  
        </div>  
      )}  
    </div>
  );
};

export default Chat;