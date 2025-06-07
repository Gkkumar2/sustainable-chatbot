import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

export default function HomePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 p-4">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Leaf className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-black dark:text-white sm:text-5xl">
                    Sustainable Chatbot
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Your AI companion for sustainable living, environmental awareness, and eco-friendly solutions.
                </p>
                <Link 
                    href="/chat" 
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
                >
                    Enter Chat
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </main>
    );
}
