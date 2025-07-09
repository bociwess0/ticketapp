'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from '../tickets/DataTable';
import type { Order, Ticket } from '@prisma/client';
import OrderComponent from '@/components/order/OrderComponent';

type OrderWithItems = Order & {
  tickets: Ticket[]
}

export default function Order() {

  const [orders, setOrders] = useState<OrderWithItems[]>([]);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await axios.get('api/order');
        console.log(response.data);
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
    getOrders();
  }, [])


  return (
    <div>
      {orders.length > 0 && orders.map((order, index) => (
        <OrderComponent order={order} index={index} key={order.id} />
      )) }
    </div>
  )
}
