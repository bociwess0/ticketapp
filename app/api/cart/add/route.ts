// app/api/cart/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/db';
import { getServerSession } from 'next-auth';
import options from '../../auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
  console.log('API route hit');
  try {
    const { cartId, ticketId, quantity } = await request.json();
    console.log('Received data:', { cartId, ticketId, quantity });

    const cart = await prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      console.error('Cart not found');
      return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      console.error('Ticket not found');
      return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cart: { connect: { id: cartId } },
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

        console.log('Received userId:', userId);

        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const cart = await prisma.cart.findFirst({ where: { userId: numericUserId} });
        if (!cart) {
            console.error("Cart not found");
            return NextResponse.json({ success: false, message: "Cart not found!" }, { status: 404 });
        }

        const cartItems = await prisma.cartItem.findMany({ where: {cartId: cart.id}})
        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ success: false, message: "Cart is empty!" }, { status: 200 });
        }

        return NextResponse.json({ cart: cart, cartItems: cartItems }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Error fetching cart for user' }, { status: 500 });
    }
}
