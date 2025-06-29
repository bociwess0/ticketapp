'use client'

import TicketPriority from '@/components/TicketPriority'
import TicketStatusBadge from '@/components/TicketStatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Cart, CartItem, Ticket } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '../redux/cartSlice'

interface Props {
  tickets: Ticket[],
  page: string,
  status?: string,
  orderBy: string,
}

interface CartObj {
    cart: Cart,
    cartItems: CartItem[]
}


export default function DataTable({ tickets, page, status, orderBy }: Props) {

    const dispatch = useDispatch();

    const addToCart = async (cartId: number, ticket: Ticket, quantity: number = 1) => {
        let ticketId = ticket.id;
        try {     
            const response = await axios.post('/api/cart/add', {
                cartId,
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

    console.log(tickets);
    

  return (
    <div className='w-full mt-5'>
        <div className='rounded-md sm:border'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Link href={{ query: { page, status, orderBy: "title" } }}>Title</Link>
                            {"title" === orderBy && (<ArrowDown className='inline p-1' />)}
                        </TableHead>
                        <TableHead>
                            <div className='flex justify-center'>
                                <Link href={{ query: { page, status, orderBy: "status" } }}>Status</Link>
                                {"status" === orderBy && (<ArrowDown className='inline p-1' />)}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className='flex justify-center'>
                                <Link href={{ query: { page, status, orderBy: "status" } }}>Priority</Link>
                                {"priority" === orderBy && (<ArrowDown className='inline p-1' />)}
                            </div>
                        </TableHead>
                        <TableHead>
                            <Link href={{ query: { page, status, orderBy: "status" } }}>Created At</Link>
                            {"createdAt" === orderBy && (<ArrowDown className='inline p-1' />)}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets ? tickets.map((ticket) => (
                        <TableRow key={ticket.id} data-href="/">
                            <TableCell><Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link></TableCell>
                            <TableCell>
                                <div className='flex justify-center'>
                                    <TicketStatusBadge status={ticket.status} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className='flex justify-center'>
                                    <TicketPriority priority={ticket.priority} />
                                </div></TableCell>
                            <TableCell>{ticket.createdAt ? 
                                new Date(ticket.createdAt).toLocaleDateString("en-US", {
                                year: "2-digit",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true
                                }) 
                                : "N/A"}</TableCell>
                            <TableCell><Button className='cursor-pointer' onClick={() => addToCart(2, ticket)}>Add to cart</Button></TableCell>
                        </TableRow>
                    )) : null}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}
