import Link from 'next/link'
import React from 'react'
import ToggleMode from './ToggleMode'
import MainNavLinks from './MainNavLinks'
import { getServerSession } from 'next-auth'
import options from '@/app/api/auth/[...nextauth]/options'
import { ShoppingCart } from 'lucide-react'
import axios from 'axios'
import CartMenuIcon from '@/app/cart/CartMenuIcon'

export default async function MainNav() {

  const session = await getServerSession(options);  

  return (
    <div className='flex justify-between'>
        <MainNavLinks role={session?.user.role}/>
        <div className='flex items-center gap-2'>
            {session ? (
              <div className='flex gap-2'>
                <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
                <Link href={`users/${session.user.id}`}>{session.user.name}</Link>
              </div>
              ) : (
              <Link href="/api/auth/signin?callbackUrl=/">Login</Link>
              )}
            <ToggleMode />
            {session && session.user && (
              <Link href='/cart'>
                <CartMenuIcon userId={session.user.id} />
              </Link>
            )}
        </div>
    </div>
  )
}
