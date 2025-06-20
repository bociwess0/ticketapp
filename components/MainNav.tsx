import Link from 'next/link'
import React from 'react'
import ToggleMode from './ToggleMode'
import MainNavLinks from './MainNavLinks'
import { getServerSession } from 'next-auth'
import options from '@/app/api/auth/[...nextauth]/options'

export default async function MainNav() {

  const session = await getServerSession(options);  

  return (
    <div className='flex justify-between'>
        <MainNavLinks role={session?.user.role}/>
        <div className='flex items-center gap-2'>
            {session ? (
              <Link href="/api/auth/signout?callbackUrl=/">Logout from {session.user.name}</Link>
              ) : (
              <Link href="/api/auth/signin?callbackUrl=/">Login</Link>
              )}
            <ToggleMode />
        </div>
    </div>
  )
}
