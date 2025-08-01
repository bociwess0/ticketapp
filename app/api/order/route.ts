import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../auth/[...nextauth]/options";
import { CartItem, Order } from "@prisma/client";
import prisma from "@/prisma/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const userId = parseInt(session.user.id as string, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const cartItems: CartItem[] = body.cartItems;

    const order = await prisma.order.create({
      data: {
        userId,
        createdAt: new Date(),
        total: cartItems.length, // Replace with real price total if needed
        status: "PENDING"
      }
    });

    await Promise.all(cartItems.map(item =>
      prisma.orderItem.create({
        data: {
          order: { connect: { id: order.id } },
          ticket: { connect: { id: item.ticketId } },
          quantity: 1
        }
      })
    ));

    return NextResponse.json({ success: true, order });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error creating order" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const userId = parseInt(session.user.id as string, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({ where: { userId: userId } });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: false, message: "No orders found!" }, { status: 404 });
    }

    const ordersFormatted = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId: order.id },
        });

        const tickets = await Promise.all(orderItems.map(async (orderItem) => {
          return await prisma.ticket.findFirst({ where: { id: orderItem.ticketId }})
        }))

        return {
          ...order,
          tickets,
        };
      })
    );

    return NextResponse.json({ success: true, orders: ordersFormatted }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error fetching orders" }, { status: 500 });
  }
}

export async function DELETE(request:NextRequest) {
  try {
      const {searchParams} = new URL(request.url);
      const ticketId = parseInt(searchParams.get("ticketId") as string, 10)
      const orderId = parseInt(searchParams.get("orderId") as string, 10)

      const session = await getServerSession(options);
      if(!session) {
        return NextResponse.json({error: "Not authentificated" }, {status: 401});
      }

      const userId:number = parseInt(session.user.id as string, 10);
      if(isNaN(userId)) {
        return NextResponse.json({success: false, message: "Invalid user ID"}, {status: 400});
      }

      const order = await prisma.order.findFirst({where: {id: orderId, userId: userId}});

      if(!order) {
        return NextResponse.json({success: false, message: "Theres no orders for this user."}, {status: 400});
      }

      let deletedTicket = await prisma.orderItem.deleteMany({ where: {orderId: order.id, ticketId: ticketId}})

      return NextResponse.json({success: true, message: "Ticket deleted from orders!", ticket: deletedTicket})

  } catch (error) {
      console.error(error);
      return NextResponse.json({success: false, message: 'Error deleteing ticket from order'}, {status: 500})
  }
}
