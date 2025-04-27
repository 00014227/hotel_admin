import { createSlice } from "@reduxjs/toolkit";
import { fetchAvailability } from "./avalibilityThunk";

const availabilitySlice = createSlice({
    name: 'availability',
    initialState: {
      data: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAvailability.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAvailability.fulfilled, (state, action) => {
          state.data = action.payload;
          state.loading = false;
        })
        .addCase(fetchAvailability.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        });
    }
  });
  
  export default availabilitySlice.reducer;