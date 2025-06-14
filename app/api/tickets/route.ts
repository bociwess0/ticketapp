import { ticketsSchema } from "@/validationSchemas/tickets";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function POST(request:NextRequest) {
    const body = await request.json();
    const validation = ticketsSchema.safeParse(body);

    if(!validation.success) {
        return NextResponse.json(validation.error.format(), {status: 400});
    }

    const newTicket = await prisma.ticket.create({
        data: {...body}
    })

    return NextResponse.json(newTicket,{ status: 201})

}