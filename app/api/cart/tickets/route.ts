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
        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        
        const userId:number = parseInt(session.user.id as string, 10);
        if(isNaN(userId)) {
            return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
        }
    

        const action = searchParams.get("action");

        if(action && action === "emptyCart") {
            return await emptyCart(userId);
        } else {

            const ticketId:number = parseInt(searchParams.get("ticketId") as string, 10);
            if(isNaN(ticketId)) {
                return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
            }

            return await deleteTicket(userId, ticketId);
        }
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: 'Error deleteing ticket from cart'}, {status: 500})
    }
}


async function deleteTicket(userId: number, ticketId: number): Promise<NextResponse> {
    const cart = await prisma.cart.findFirst({where: {userId: userId}})
    if (!cart) {
        return NextResponse.json({ error: "Cart does not exist" }, { status: 401 });
    }

    if (!ticketId) {
        return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
    }
    
    await prisma.cartItem.deleteMany({
        where: {ticketId: ticketId}
    })

    return NextResponse.json({success: true, message: "Ticket Deleted"})
}


async function emptyCart(userId: number): Promise<NextResponse> {

    const cart = await prisma.cart.findFirst({where: {userId: userId}})

    if (!cart) {
        return NextResponse.json({ error: "Cart does not exist" }, { status: 401 });
    }
    
    await prisma.cartItem.deleteMany({
        where: {cartId: cart.id}
    })

    await prisma.cart.delete({
        where: {id: cart.id}
    })

    return NextResponse.json({success: true, message: "Cart is emptied!"})

}