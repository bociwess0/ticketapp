'use client'
import React from 'react'
import { Button } from '../ui/button'
import { CartItem } from '@prisma/client'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { emptyCartRequest } from '@/requests/cartRequests';

interface CartItems {
  cartItems: CartItem[]
}

export default function CheckoutButton({cartItems}: CartItems) {

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  async function handleAddOrder() {
    if(!cartItems || cartItems.length === 0) {
      console.log("Empty array of cart items!");
      return;
    }

    try {
      const response = await axios.post('api/order', { cartItems: cartItems });
      if(response.data.success) {
        console.log('Order added to cart successfully!', response.data.order);
        toast.success(`Order with id ${response.data.order.id} successully created!`)
        setTimeout(() => {
          router.push("/order");
        }, 500);

        await emptyCartRequest(dispatch);

      } else {
        console.error('Failed to add order');
        toast.error("Failed to add ticket")
      }
    } catch (error) {
      console.error('Failed while requiesting an order');
      toast.error("Failed while requiesting an order")
    }

  }
    
  return (
    <Button onClick={handleAddOrder} className='max-w-50 cursor-pointer'>Complete Order</Button>
  )
}
