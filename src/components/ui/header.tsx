"use client";

import { ThemeSwitcher } from "./theme-switcher";
import { Logo } from "./logo";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Logo />
                </div>
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
} 