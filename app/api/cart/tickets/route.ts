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

export async function DELETE(request:NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const ticketId = searchParams.get("ticketId");
        const cartId = searchParams.get("cartId");

        if (!ticketId) {
            return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
        }

        if (!cartId) {
            return NextResponse.json({ error: "Missing cartId" }, { status: 400 });
        }

        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const cart = await prisma.cart.findUnique({
            where: {id: parseInt(cartId)}
        })

        if (!cart) {
            return NextResponse.json({ error: "Cart does not exist" }, { status: 401 });
        }
        
        await prisma.cartItem.deleteMany({
            where: {ticketId: parseInt(ticketId)}
        })

        return NextResponse.json({success: true, message: "Ticket Deleted"})


    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: 'Error deleteing ticket from cart'}, {status: 500})
    }
}
