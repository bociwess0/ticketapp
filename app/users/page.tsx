import UserForm from '@/components/UserForm'
import React from 'react'
import DataTableSimple from './data-table-simple'
import prisma from '@/prisma/db'
import { getServerSession } from 'next-auth';
import options from '../api/auth/[...nextauth]/options';

export default async function Users() {

  const users = await prisma.user.findMany();
  const session = await getServerSession(options);

  if(session?.user.role !== "ADMIN") {
    return <p className='text-destructive'>Admin access required</p>
  }

  return (
    <div className=''>
      <UserForm />
      <DataTableSimple users={users} />
    </div>
  )
}
