import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient";


export const fetchHotelsWithRooms = createAsyncThunk(
    'hotels/fetchHotelsWithRooms',
    async (admin_id) => {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, rooms(id, room_name)')
        .eq('admin_id', admin_id);
  
      if (error) throw error;
      return data;
    }
  );