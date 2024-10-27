'use client'

import { useState } from "react";

export default function ToggleTheme() {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        if (theme === 'light') {
            document.body.classList.add('dark');

            setTheme('dark');
        } else {
            document.body.classList.remove('dark');
            setTheme('light');
        }
    }
    return (
        <div className="p-1 border-2 rounded-full">
            {theme === 'light' ? (
                <img src="/images/light.svg" alt="Light Mode" onClick={toggleTheme}/>
            ) : (
                <img src="/images/night.svg" alt="Dark Mode" onClick={toggleTheme}/>
            )}
        </div>
    )
}