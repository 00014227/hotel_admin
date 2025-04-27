import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient";

export const fetchAvailability = createAsyncThunk(
    'availability/fetchAvailability',
    async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in_date, check_out_date, status');
      if (error) throw error;
      return data;
    }
);