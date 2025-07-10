import { Ticket } from "@prisma/client";
import axios from "axios"
import toast from "react-hot-toast";

export const deleteOrderItem = async(orderId: number, ticket: Ticket) => {
    try {
        const response = await axios.delete("/api/order", {params: { orderId: orderId, ticketId: ticket.id }});
        if(response.data.success) {
            toast.success(`${ticket.title} successfully deleted from orders`)
        } else {
            console.error('Failed to delete ticket from order.');
            toast.error("Failed to delete ticket from order.")
        }
    } catch (error) {
        console.error('Error while deliting ticket from orders:', error);
        toast.error("Error while deliting ticket from orders.")
    }
}