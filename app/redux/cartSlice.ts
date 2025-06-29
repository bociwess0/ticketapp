import { CartWithItems } from "@/types";
import { Cart, CartItem } from "@prisma/client";
import {combineReducers, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: { cart: CartWithItems | null, totalItemsInCart: number } = {
    cart: null,
    totalItemsInCart: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        retrieveCart: (state, action: PayloadAction<{cart: CartWithItems}>) => {
            state.cart = action.payload.cart;
            state.totalItemsInCart = action.payload.cart.items.length;
        },
        addItemToCart: (state, action:PayloadAction<{cartItem: CartItem}>) => {
            state.cart?.items.push(action.payload.cartItem);
            state.totalItemsInCart++;
        }
    }
})

const cartReducer = cartSlice.reducer;
const rootReducer = combineReducers({});

export const retrieveCart = cartSlice.actions.retrieveCart;
export const addItemToCart = cartSlice.actions.addItemToCart;
export type RootStateCart = ReturnType<typeof rootReducer>;

export default cartReducer;