import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from "../../supabaseClient";

export const saveUserToSupabase = createAsyncThunk(
    'user/saveUser',
    async (userData, { rejectWithValue }) => {
      try {
        const { email } = userData;
  
        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('user')
          .select('*')
          .eq('email', email)
          .single();
  
        if (fetchError && fetchError.code !== 'PGRST116') {
          // Supabase returns this code when no record is found
          throw fetchError;
        }
  
        if (existingUser) {
          // Update user
          const { error: updateError } = await supabase
            .from('user')
            .update(userData)
            .eq('email', email);
          if (updateError) throw updateError;
          return { message: 'User updated' };
        } else {
          // Insert new user
          const { error: insertError } = await supabase
            .from('user')
            .insert([userData]);
          if (insertError) throw insertError;
          return { message: 'User created' };
        }
      } catch (err) {
        return rejectWithValue(err.message || 'Error saving user');
      }
    }
  );

