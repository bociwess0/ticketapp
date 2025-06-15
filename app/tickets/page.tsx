import React from 'react'
import prisma from '@/prisma/db'
import DataTable from './DataTable';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

interface SearchParams {
  page: string
}

export default async function Tickets({searchParams}: { searchParams: SearchParams }) {

  const pageSize = 10;

  const page = parseInt(searchParams.page) || 1;
  const ticketCount = await prisma.ticket.count();

    const tickets = await prisma?.ticket.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize
    });

  return (
    <div>
      <Link href='/tickets/new' className={buttonVariants({variant: "default"})}>New Ticket</Link>
      <DataTable tickets={tickets} />
      <Pagination itemCount={ticketCount} pageSize={10} currentPage={page} />
    </div>
  )
}
