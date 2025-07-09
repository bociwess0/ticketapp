// app/api/cart/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/db';
import { getServerSession } from 'next-auth';
import options from '../../auth/[...nextauth]/options';

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
    const { ticketId, quantity } = await request.json();

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
    }

    let cart = await prisma.cart.findFirst({ where: { userId: userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
        },
      });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cart: { connect: { id: cart.id } },
        ticket: { connect: { id: ticketId } },
        quantity: quantity || 1,
      },
    });

    return NextResponse.json({ success: true, cartItem });
  } catch (error) {
        console.error(error);
    return NextResponse.json({ success: false, message: 'Error adding to cart' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const numericUserId = userId ? parseInt(userId, 10) : undefined;

        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const cart = await prisma.cart.findFirst({ where: { userId: numericUserId} });
        if (!cart) {
            console.error("Cart not found");
            return NextResponse.json({ success: false, message: "Cart not found!" }, { status: 404 });
        }

        const cartItems = await prisma.cartItem.findMany({ where: {cartId: cart.id}})
        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ success: false, message: "Cart is empty!", emptyCart: true }, { status: 200 });
        }

        return NextResponse.json({ cart: cart, cartItems: cartItems }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Error fetching cart for user' }, { status: 500 });
    }
}
