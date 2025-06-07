"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

export function Logo() {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
    >
      <div className="bg-green-100 dark:bg-green-900 w-9 h-9 rounded-full flex items-center justify-center">
        <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>
      <span className="text-lg font-semibold text-gray-900 dark:text-white">
        EcoChat
      </span>
    </Link>
  );
} 