import { ticketsSchema } from "@/validationSchemas/tickets";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

interface Props {
    params: {id: string}
}

export async function PATCH(request:NextRequest, {params}: Props) {
    const body = await request.json();
    const validation = ticketsSchema.safeParse(body);
    if(!validation.success) {
        return NextResponse.json(validation.error.format(), {status: 401})
    }

    const ticket = await prisma.ticket.findUnique({where: {id: parseInt(params.id)}});

    if(!ticket) {
        return NextResponse.json({error: "Titcket Not Found"}, {status: 401})
    }

    const updaetTicket = await prisma.ticket.update({
        where: {id: ticket.id},
        data: {
            ...body
        }
    })

    return NextResponse.json(updaetTicket);

}

export async function DELETE(request:NextRequest, {params}: Props) {

    const ticket =  await prisma.ticket.findUnique({
        where: {id: parseInt(params.id)}
    })

    if(!ticket) {
        return NextResponse.json({error: "Titcket Not Found"}, {status: 401})
    }

    await prisma.ticket.delete({
        where: {id: ticket.id}
    })

    return NextResponse.json({message: "Ticket Deleted"})
}