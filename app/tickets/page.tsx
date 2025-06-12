import React from 'react'
import prisma from '@/prisma/db'

export default async function Tickets() {

  const tickets = await prisma?.ticket.findMany();

  console.log(tickets);

  return (
    <div>
      Tickets
    </div>
  )
}
