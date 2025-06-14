import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { z } from 'zod'
import { ticketsSchema } from '@/validationSchemas/tickets'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';

type TicketFormData = z.infer<typeof ticketsSchema>;

export default function TicketForm() {

    const form = useForm<TicketFormData>({
        resolver: zodResolver(ticketsSchema)
    });

    async function onSubmit(values:z.infer<typeof ticketsSchema>) {
        console.log(values);
    }

    return (
        <div className='rounded-md border w-full p-4'>
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                <FormField control={form.control} name='title' render={({field}) => (
                    <FormItem>
                        <FormLabel>Ticket Title</FormLabel>
                        <FormControl>
                            <Input placeholder='Ticket title...' {...field} />
                        </FormControl>
                    </FormItem>
                )} />
                <Controller name='description' control={form.control} render={({field}) => (
                    <SimpleMDE placeholder='description' {...field} />
                )} />
                <div className='flex w-full space-x-4'>
                    <FormField control={form.control} name='status' render={({field}) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status..." />
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
                    <FormField control={form.control} name='priority' render={({field}) => (
                        <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Priority..." />
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
            </form>
        </Form>
        </div>
    )
}
