import { Ticket } from '@prisma/client'
import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import TicketStatusBadge from '@/components/TicketStatusBadge'
import TicketPriority from '@/components/TicketPriority'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import DeleteTicketButton from './DeleteTicketButton'

interface Props {
    ticket: Ticket
}

export default function TicketDetail({ticket}: Props) {


  return (
    <div className='lg:grid lg:grid-cols-4'>
        <Card className='mx-4 mb-4 lg:col-span-3 lg:mr-4'>
            <CardHeader>
                <div className='flex justify-between mb-3'>
                    <TicketStatusBadge status={ticket.status} />
                    <TicketPriority priority={ticket.priority} />
                </div>
                <CardTitle>{ticket.title}</CardTitle>
                <CardDescription>Created: {ticket.createdAt.toLocaleDateString("en-US", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                })}</CardDescription>
                <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent className='prose dark:prose-invert'>
                <ReactMarkdown>{ticket.description}</ReactMarkdown>
            </CardContent>
            <CardFooter>
                Updated: {ticket.createdAt.toLocaleDateString("en-US", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                })}
            </CardFooter>
        </Card>
        <div className='mx-4 flex lg:flex-col lg:mx-0 gap-3'>
            <Link href={`/tickets/edit/${ticket.id}`} className={`${buttonVariants({
                variant: "default"
            })}`} >Edit Ticket</Link>
            <DeleteTicketButton ticketId={ticket.id} />
        </div>
    </div>
  )
}
