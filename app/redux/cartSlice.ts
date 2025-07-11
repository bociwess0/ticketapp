import { CartWithItems } from "@/types";
import { Cart, CartItem, Ticket } from "@prisma/client";
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
        },
        deleteItemFromCart:(state, action:PayloadAction<{id: number}>) => {
            if (state.cart) {
                state.cart.items = state.cart.items.filter((item) => item.ticketId !== action.payload.id);
                state.totalItemsInCart = state.cart.items.length;
            }   
        },
        emptyCart:(state) => {
            if(state.cart) {
                state.cart.items = [];
                state.totalItemsInCart = 0;
            }
        }
    }
})

const cartReducer = cartSlice.reducer;
const rootReducer = combineReducers({});

export const retrieveCart = cartSlice.actions.retrieveCart;
export const addItemToCart = cartSlice.actions.addItemToCart;
export const deleteItemFromCart = cartSlice.actions.deleteItemFromCart;
export const emptyCart = cartSlice.actions.emptyCart;
export type RootStateCart = ReturnType<typeof rootReducer>;

export default cartReducer;