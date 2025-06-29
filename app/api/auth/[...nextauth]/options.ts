import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "password",
      name: "Username and Password",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username...",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { username: credentials!.username },
        });

        if (!user) {
          return null;
        }

        const match = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        console.log({
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
          });
        

        if (match) {
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
          };
        }        

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      
      if (account) {
        token.role = user.role;
        token.id = user.id;
      }      
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || 'USER';
        session.user.username = token.username as string;
      }            
      return session;
    },
  },
};

export default options;