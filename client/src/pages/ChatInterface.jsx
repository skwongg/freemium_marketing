// src/components/ChatInterface.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, addMessage } from '../features/chat/chatSlice';

function ChatInterface() {
  const [message, setMessage] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [initialInput, setInitialInput] = useState('');
  const dispatch = useDispatch();
  const { messages, status, error } = useSelector((state) => state.chat);

  const handleStart = (e) => {
    e.preventDefault();
    if (!initialInput.trim()) return;

    // You can use this initial input however you want
    // For example, send a welcome message with the input
    dispatch(addMessage({
      id: Date.now(),
      text: `Chat started with topic: ${initialInput}`,
      sender: 'system',
      timestamp: new Date().toISOString()
    }));
    console.log("is started set to true!")
    setIsStarted(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    dispatch(addMessage({
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    }));

    await dispatch(sendMessage(message));
    setMessage('');
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Welcome to Chat
          </h2>
          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label htmlFor="initialInput" className="block text-sm font-medium text-gray-700 mb-1">
                What would you like to discuss today?
              </label>
              <input 
                type="text"
                id="initialInput"
                value={initialInput}
                onChange={(e) => setInitialInput(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a domain to begin"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Optional Topic Display */}
      <div className="bg-white shadow-sm p-2 text-center text-gray-600">
        Topic: {initialInput}
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'user' 
                ? 'justify-end' 
                : msg.sender === 'system' 
                  ? 'justify-center' 
                  : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : msg.sender === 'system'
                  ? 'bg-gray-200 text-gray-800 text-sm'
                  : 'bg-white text-gray-800'
              } shadow`}
            >
              <pre className="whitespace-pre-wrap break-words">
                {msg.text}
              </pre>
              <span className="text-xs opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center">
            Error: {error}
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white shadow-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={status === 'loading'}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInterface;
