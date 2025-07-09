'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootStateCart } from '../redux/cartSlice';
import { CartWithItems } from '@/types';
import { CartItem } from '@prisma/client';
import DataTable from '../tickets/DataTable';
import CheckoutButton from '@/components/cart/CheckoutButton';

export default function Cart() {

  const cart: CartWithItems = useSelector((state: RootStateCart) => state.cartActions.cart);
  const totalItemsInCart:number = useSelector((state: RootStateCart) => state.cartActions.totalItemsInCart);
  
  const [foundTickets, setFoundTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartFetched, setCartFetched] = useState(false);
  
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
            setIsLoading(false);
            setCartFetched(true);            
          } catch (error) {
            console.error('Error fetching tickets from cart:', error);
            setIsLoading(false);
            setCartFetched(true);
          }
        }

        getTicketsFromCart();
    } else {
      setIsLoading(false);
    }
  }, [cart])    


  if(isLoading) {
    return <p>Loading cart...</p>
  }

  if(!isLoading && cartFetched && (!cart || totalItemsInCart === 0)) {
    return <p className='text-destructive'>Your cart is empty!</p>
  }
  
  return (
    <div>
      <div className='text-2xl'>Your Cart</div>
      {foundTickets.length > 0 && (
        <div className='flex flex-col gap-5 items-end'>
          <DataTable tickets={foundTickets} orderBy='createdAt' page='cart'/>
          <CheckoutButton cartItems={cart.items}/>
        </div>
      )}
    </div>
  )
}
