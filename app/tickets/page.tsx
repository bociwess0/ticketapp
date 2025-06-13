import React from 'react'
import prisma from '@/prisma/db'
import DataTable from './DataTable';

export default async function Tickets() {

  const tickets = await prisma?.ticket.findMany();

  console.log(tickets);

  return (
    <div>
      <DataTable tickets={tickets} />
    </div>
  )
}
