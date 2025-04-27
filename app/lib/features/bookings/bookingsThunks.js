import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient";

export const fetchReservations = createAsyncThunk(
    'reservations/fetchReservations',
    async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in_date,
          check_out_date,
          status,
          user (
            id,
            name,
            email
          ),
          rooms (
            room_name,
            hotels (
              name
            )
          ),
          payments (
            amount,
            created_at
          )
        `);
  
      if (error) throw error;
      return data;
    }
  );