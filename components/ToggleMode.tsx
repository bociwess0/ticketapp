'use client'

import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

export default function ToggleMode() {

    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    if(!mounted) {
        return (
            <Button variant="outline" size='icon' disabled > </Button>
        )
    }

    const dark = theme === "dark";

    return (
        <Button className='cursor-pointer' variant="outline" size='icon' onClick={() => setTheme(`${dark ? "light" : "dark"}`)}>
            {dark ? (
                <Sun className='hover:cursor-pointer hover:text-primary' />
            ) : (
                <Moon className='hover:cursor-pointer hover:text-primary' />
            )}
        </Button>
    )
}
