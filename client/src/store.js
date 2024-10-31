// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chat/chatSlice';
import searchReducer from './features/search/searchSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    search: searchReducer,
  },
});
