import { createSlice } from "@reduxjs/toolkit";
import { fetchHotelsWithRooms } from "./objectsThunks";

const hotelsSlice = createSlice({
    name: 'hotels',
    initialState: {
      data: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchHotelsWithRooms.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchHotelsWithRooms.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchHotelsWithRooms.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    },
  });
  
  export default hotelsSlice.reducer;