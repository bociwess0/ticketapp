'use client'
import React, { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Props {
    ticketId: number
}

export default function DeleteTicketButton({ticketId}: Props) {

    const router = useRouter();
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const deleteTicket = async() => {
        try {
            setIsDeleting(true);
            await axios.delete("/api/tickets/" + ticketId);
            setIsDeleting(false);
            router.push("/tickets");
            router.refresh();
        } catch (error) {
            setIsDeleting(false);
            setError("Error occured!");
        }
    }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className={`${buttonVariants({variant: "destructive"})} w-full cursor-pointer`}>Delete</AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className={`cursor-pointer`}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    className={`${buttonVariants({variant: "destructive"})} cursor-pointer`}
                    disabled={isDeleting}
                    onClick={deleteTicket}
                    >
                        Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
        {error && <p className='text-destructive'>{error}</p>}
    </div>
  )
}
