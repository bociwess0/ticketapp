"use client";

import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { z } from 'zod'
import { ticketsSchema } from '@/validationSchemas/tickets'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { Button } from './ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Ticket } from '@prisma/client';

type TicketFormData = z.infer<typeof ticketsSchema>;

interface Props {
    ticket?: Ticket
}

export default function TicketForm({ticket}: Props) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();


    const form = useForm<TicketFormData>({
        resolver: zodResolver(ticketsSchema)
    });

    async function onSubmit(values:z.infer<typeof ticketsSchema>) {
         try {
            setIsSubmitting(true);
            setError("");

            if (ticket) {
                await axios.patch("/api/tickets/" + ticket.id, values);
            } else {
                await axios.post("/api/tickets", values);
            }
            setIsSubmitting(false);
            router.push("/tickets");
            router.refresh();
        } catch (error) {
            console.log(error);
            setError("Unknown Error Occured.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className='rounded-md border w-full p-4'>
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                <FormField control={form.control} defaultValue={ticket?.title} name='title' render={({field}) => (
                    <FormItem>
                        <FormLabel>Ticket Title</FormLabel>
                        <FormControl>
                            <Input placeholder='Ticket title...' {...field} />
                        </FormControl>
                    </FormItem>
                )} />
                <Controller name='description' control={form.control} defaultValue={ticket?.description} render={({field}) => (
                    <SimpleMDE placeholder='description' {...field} />
                )} />
                <div className='flex w-full space-x-4'>
                    <FormField control={form.control} defaultValue={ticket?.status} name='status' render={({field}) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status..." defaultValue={ticket?.status}/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value='OPEN'>OPEN</SelectItem>
                                    <SelectItem value='STARTED'>STARTED</SelectItem>
                                    <SelectItem value='CLOSED'>CLOSED</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name='priority' defaultValue={ticket?.priority} render={({field}) => (
                        <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Priority..." defaultValue={ticket?.priority} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value='LOW'>LOW</SelectItem>
                                    <SelectItem value='MEDIUM'>MEDIUM</SelectItem>
                                    <SelectItem value='HIGH'>HIGH</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                </div>
                <Button type='submit' disabled={isSubmitting} className='cursor-pointer'>{ticket ? "Update Ticket" : "Create Ticket"}</Button>
            </form>
        </Form>
        <p className='text-destructive'>{error}</p>
        </div>
    )
}
