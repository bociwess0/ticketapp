import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        cartActions: cartReducer
    }
})