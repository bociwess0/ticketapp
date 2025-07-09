'use client'

import { CartWithItems } from '@/types'
import { Cart, CartItem } from '@prisma/client'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { retrieveCart, RootStateCart } from '../redux/cartSlice'

interface Props {
    userId: number | string | undefined
}

interface CartObj {
    cart: Cart,
    cartItems: CartItem[],
}

export default function CartMenuIcon({userId}: Props) {

    const dispatch = useDispatch();
    const totalItemsInCart:number = useSelector((state: RootStateCart) => state.cartActions.totalItemsInCart);


    useEffect(() => {
        const fetchCart = async () => {
            try {                
                const response = await axios.get('/api/cart/add', { params: {userId: userId} });       
                if (!response.data.cartEmpty && response.data.cart && response.data.cartItems) {
                    const cartObj: CartObj = {
                        cart: response.data.cart,
                        cartItems: response.data.cartItems
                    };

                    const cartRedux: CartWithItems = {
                        id: cartObj.cart.id,
                        createdAt: cartObj.cart.createdAt,
                        updatedAt: cartObj.cart.updatedAt,
                        userId: cartObj.cart.userId,
                        items: cartObj.cartItems
                    };

                    dispatch(retrieveCart({ cart: cartRedux }));
                } else {
                    console.log("Cart is empty or invalid response!", response.data);
                }
            } catch (error) {
                console.log('Error fetching cart:', error);
            }
        }

        if (userId) {
            fetchCart();
        }
    }, [userId]);    

    return (
        <div className="relative">
            <ShoppingCart />
            <div className="bg-red-400 w-5 h-5 rounded-2xl absolute top-[-8px] 
                right-[-13px] text-xs flex justify-center items-center">{totalItemsInCart}</div>
        </div>
    )
}
