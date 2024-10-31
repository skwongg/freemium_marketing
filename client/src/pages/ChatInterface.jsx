// src/pages/ChatInterface.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { performSearch } from '../features/search/searchSlice';
import { addMessage } from '../features/chat/chatSlice';

function ChatInterface() {
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.chat.messages);
  const searchStatus = useSelector((state) => state.search.status);
  const searchResults = useSelector((state) => state.search.results);
  const searchError = useSelector((state) => state.search.error);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Dispatch search action
      const resultAction = await dispatch(performSearch(searchQuery));

      // Add search query to chat
      dispatch(addMessage({
        id: Date.now(),
        text: `Searching for: ${searchQuery}`,
        sender: 'user',
        timestamp: new Date().toISOString(),
      }));

      // If search was successful, add results to chat
      if (performSearch.fulfilled.match(resultAction)) {
        dispatch(addMessage({
          id: Date.now() + 1,
          text: `Search Results: ${JSON.stringify(resultAction.payload, null, 2)}`,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        }));
      }
    } catch (error) {
      dispatch(addMessage({
        id: Date.now() + 1,
        text: `Error performing search: ${error.message}`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      }));
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Search Bar */}
      <div className="w-full bg-white shadow-md p-4">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
            />
            <button
              type="submit"
              disabled={searchStatus === 'loading'}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50"
            >
              {searchStatus === 'loading' ? (
                // Loading spinner
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (  
                // Search icon
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Search Status Messages */}
          {searchStatus === 'failed' && (
            <p className="mt-2 text-red-500 text-sm">
              Error: {searchError}
            </p>
          )}
        </form>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow flex flex-col bg-gray-50 p-4">
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
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
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;