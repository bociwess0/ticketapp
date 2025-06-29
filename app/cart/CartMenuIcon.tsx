'use client'

import { CartWithItems } from '@/types'
import { Cart, CartItem } from '@prisma/client'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { retrieveCart, RootStateCart } from '../redux/cartSlice'

interface Props {
    userId: number | string | undefined
}

interface CartObj {
    cart: Cart,
    cartItems: CartItem[]
}

export default function CartMenuIcon({userId}: Props) {

    const [cartCount, setCartCount] = useState(0);
    const dispatch = useDispatch();
    const totalItemsInCart:number = useSelector((state: RootStateCart) => state.cartActions.totalItemsInCart);
    const cartItems:CartItem[] = useSelector((state: RootStateCart) => state.cartActions.cartItems);


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('/api/cart/add', { params: {userId: userId} });
                const cartObj :CartObj = response.data;
                const cartRedux: CartWithItems = {
                    id: cartObj.cart.id,
                    createdAt: cartObj.cart.createdAt,
                    updatedAt: cartObj.cart.updatedAt,
                    userId: cartObj.cart.userId,
                    items: cartObj.cartItems
                }
                setCartCount(cartObj.cartItems.length);
                dispatch(retrieveCart({cart: cartRedux}));
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        }

        if (userId) {
            fetchCart();
        }
    }, [userId]);    

    return (
        <div className="relative">
            <ShoppingCart />
            {cartCount > 0 && (
                <div className="bg-red-400 w-5 h-5 rounded-2xl absolute top-[-8px] 
                right-[-13px] text-xs flex justify-center items-center">{totalItemsInCart}</div>
            )}
        </div>
    )
}
