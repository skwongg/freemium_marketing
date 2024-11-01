// src/features/chat/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message) => {
    const response = await axios.post('http://localhost:8000/chat', {
      text: message,
      domain: message
    });
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push({
          id: Date.now(),
          text: action.payload.response,
          sender: 'assistant',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;