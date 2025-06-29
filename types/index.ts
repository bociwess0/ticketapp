import { Cart, CartItem } from "@prisma/client";

export type CartWithItems = Cart & {
  items: CartItem[];
};