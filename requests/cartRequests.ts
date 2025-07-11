import { addItemToCart, deleteItemFromCart, emptyCart } from "@/app/redux/cartSlice";
import { AppDispatch } from "@/app/redux/store";
import { Ticket } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";

export const addToCart = async (ticket: Ticket, dispatch: AppDispatch, quantity: number = 1,) => {
    let ticketId = ticket.id;
    try {     
        const response = await axios.post('/api/cart/add', {
            ticketId,
            quantity,
        });            
                
        if (response.data.success) {
            console.log('Ticket added to cart successfully!', response.data.cartItem);
            dispatch(addItemToCart({cartItem: response.data.cartItem}))
            toast.success(`${ticket.title} successfully added to cart`);
        } else {
            console.error('Failed to add ticket to cart.');
            toast.error("Failed to add ticket to cart.")
        }
    } catch (error) {
        console.error('Error adding ticket to cart:', error);
        toast.error("Failed to add ticket to cart.")
    }
};

export const deleteFromCart = async(ticket: Ticket, dispatch:AppDispatch) => {
    try {
        const response = await axios.delete("/api/cart/tickets", { params: { ticketId: ticket.id }})
        if(response.data.success) {
            console.log("Ticket successfully deleted form cart!");
            dispatch(deleteItemFromCart({id: ticket.id}))
            toast.success(`${ticket.title} successfully deleted from cart`);
        }else {
            console.error('Failed to delete ticket from cart.');
            toast.error("Failed to delete ticket from cart.")
        }
    } catch (error) {
        console.error('Error while deliting ticket from cart:', error);
        toast.error("Error while deliting ticket from cart.")
    }
}

export const emptyCartRequest = async(dispatch:AppDispatch) => {
    try {
        const response = await axios.delete('api/cart/tickets', { params: { action: "emptyCart"} });
        if(response.data.success) {
            toast.success(response.data.message);
            dispatch(emptyCart());
        }
    } catch (error) {
        console.error('Failed to empty cart!');
        toast.error("Failed to empty cart!")
    }
}