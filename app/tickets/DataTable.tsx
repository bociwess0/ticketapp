import TicketPriority from '@/components/TicketPriority'
import TicketStatusBadge from '@/components/TicketStatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Ticket } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { SearchParams } from './page'
import { ArrowDown } from 'lucide-react'

interface Props {
  tickets: Ticket[],
  page: string,
  status?: string,
  orderBy: string,
}

export default function DataTable({ tickets, page, status, orderBy }: Props) {
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
                            <TableCell>{ticket.createdAt.toLocaleDateString("en-US", {
                                year: "2-digit",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true
                            })}</TableCell>
                        </TableRow>
                    )) : null}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}
