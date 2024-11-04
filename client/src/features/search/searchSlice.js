// src/features/search/searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const performSearch = createAsyncThunk(
  'search/performSearch',
  async (searchQuery) => {
    try {
      // const response = await axios.post('http://127.0.0.1:8000/search', {
      const response = await axios.post('http://host.docker.internal:8000/search', {
        query: searchQuery,
        headers: {"Access-Control-Allow-Origin": "*"}
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
        state.error = null;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearResults } = searchSlice.actions;
export default searchSlice.reducer;
