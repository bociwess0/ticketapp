import React from 'react'
import prisma from '@/prisma/db'
import DataTable from './DataTable';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import StatusFilter from '@/components/StatusFilter';
import { Status, Ticket } from '@prisma/client';

export interface SearchParams {
  status: Status,
  page: string,
  orderBy: keyof Ticket
}


export default async function Tickets({searchParams}: { searchParams: SearchParams }) {

  const pageSize = 10;

  const page = parseInt(searchParams.page) || 1;
  const ticketCount = await prisma.ticket.count();

  const OrderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";

  const statuses = Object.values(Status)
  const status = statuses.includes(searchParams.status) ? searchParams.status : undefined;

  let where = {};

  if(status) {
    where = {
      status
    }
  }

  const tickets = await prisma?.ticket.findMany({
    where,
    orderBy: {
      [OrderBy]: "desc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize
  });

  return (
    <div>
      <div className="flex gap-2">
        <Link
          href="/tickets/new"
          className={buttonVariants({ variant: "default" })}
        >
          New Ticket
        </Link>
        <StatusFilter />
      </div>
      <DataTable tickets={tickets} page={searchParams.page} status={searchParams.status}  orderBy={searchParams.orderBy}/>
      <Pagination
        itemCount={ticketCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  )
}
