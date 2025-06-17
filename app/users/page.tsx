import UserForm from '@/components/UserForm'
import React from 'react'
import DataTableSimple from './data-table-simple'
import prisma from '@/prisma/db'

export default async function Users() {

  const users = await prisma.user.findMany();

  return (
    <div className=''>
      <UserForm />
      <DataTableSimple users={users} />
    </div>
  )
}
