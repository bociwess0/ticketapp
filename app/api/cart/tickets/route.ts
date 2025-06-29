import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../../auth/[...nextauth]/options";
import prisma from "@/prisma/db";
import { Ticket } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const ticketIdsString= searchParams.get("ticketIds");
        const ticketIds:string[] = ticketIdsString ? ticketIdsString.split(',') : [];
        const parsedIds = ticketIds.map(id => parseInt(id)).filter(id => !isNaN(id));
        
        console.log("Ticket ids:", parsedIds);

        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }        
        
        const ticketArray = await Promise.all(
            parsedIds.map(ticketId => (
                prisma.ticket.findFirst({where: {id: ticketId}})
            ))
        )                

        return NextResponse.json({ tickets: ticketArray }, { status: 200 });


    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Error fetching cart for user' }, { status: 500 });
    }
}
