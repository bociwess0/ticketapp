import React from 'react'
import prisma from '@/prisma/db'
import DataTable from './DataTable';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default async function Tickets() {

  const tickets = await prisma?.ticket.findMany();

  return (
    <div>
      <Link href='/tickets/new' className={buttonVariants({variant: "default"})}>New Ticket</Link>
      <DataTable tickets={tickets} />
    </div>
  )
}
