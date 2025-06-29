import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../../auth/[...nextauth]/options";
import prisma from "@/prisma/db";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await request.json();
        console.log('Received data:', { userId });

        console.log('Received userId:', userId);

        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const cart = await prisma.cart.findFirst({ where: { userId: userId } });
        if (!cart) {
            console.error("Cart not found");
            return NextResponse.json({ success: false, message: "Cart not found!" }, { status: 404 });
        }

        return NextResponse.json({ cart: cart }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Error fetching cart for user' }, { status: 500 });
    }
}
