'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootStateCart } from '../redux/cartSlice';
import { CartWithItems } from '@/types';
import { CartItem } from '@prisma/client';
import DataTable from '../tickets/DataTable';

export default function Cart() {

  const cart: CartWithItems = useSelector((state: RootStateCart) => state.cartActions.cart);
  
  const [foundTickets, setFoundTickets] = useState([]);
  
  
  useEffect(() => {
      if(cart && cart.items && cart.items.length > 0) {

        let ticketIds:number[] = [];
        
        ticketIds = cart.items.map((cartItem: CartItem) => {
          return cartItem.ticketId;
        })        
      
        async function getTicketsFromCart() {
          try {
            const response = await axios.get('api/cart/tickets', {params: {ticketIds: ticketIds.toString()}})
            setFoundTickets(response.data.tickets);
            console.log(response.data.tickets);
            
            console.log("Found tickets in cart:", response.data.tickets);
            
          } catch (error) {
            console.error('Error fetching tickets from cart:', error);
          }
        }

        getTicketsFromCart();
    }
  }, [cart])    
  
  
  return (
    <div>
      <div className='text-2xl'>Your Cart</div>
      {foundTickets.length > 0 && (
        <DataTable tickets={foundTickets} orderBy='createdAt' page='cart'/>
      )}
    </div>
  )
}
