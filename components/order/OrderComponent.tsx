import DataTable from '@/app/tickets/DataTable'
import type { Order, Ticket } from '@prisma/client'
import React from 'react'

type OrderWithItems = Order & {
  tickets: Ticket[],
}

type Props = {
    order: OrderWithItems,
    index: number
}

export default function OrderComponent({order, index}: Props) {
  return (
    <div className="mb-10" key={order.id}>
        <p className=''>Order {index + 1}</p>
        <div className='flex flex-col gap-5 items-end'>
            <DataTable tickets={order.tickets} orderBy='createdAt' page='order'/>
        </div>
    </div>
  )
}
