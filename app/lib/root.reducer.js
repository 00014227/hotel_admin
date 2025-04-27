import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./features/auth/auth.slice";
import hotelsSlice from "./features/objects/objects.slice"
import bookingsSlice from "./features/bookings/bookings.slice"
import availabilitySlice from "./features/avalibility/availabilitySlice"

export const rootReducer = combineReducers({
    auth: authSlice,
    objects: hotelsSlice,
    bookings: bookingsSlice,
    availability: availabilitySlice
})