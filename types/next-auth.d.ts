import { Role } from "@prisma/client";
import NextAuth, {DefaultSession} from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            username: string,
            role: string;
            id: string | number | undefined
        } & DefaultSession["user"]
    }

    interface User {
        id: number,
        name: string,
        username: string,
        role: Role
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string,
        username: string;
        id?: string | number
    }
}