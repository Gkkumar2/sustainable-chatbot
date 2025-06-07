"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    Leaf,
    Send,
    Loader2,
    TreePine,
    Recycle,
    Droplets,
    Wind,
} from "lucide-react";
import { useChat, type Message } from "@/hooks/useChat";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (reset = false) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        if (reset) {
            textarea.style.height = `${minHeight}px`;
            return;
        }

        textarea.style.height = `${minHeight}px`;
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = `${
            maxHeight ? Math.min(scrollHeight, maxHeight) : scrollHeight
        }px`;
    };

    return { textareaRef, adjustHeight };
}

function ChatMessage({ message }: { message: Message }) {
    const isUser = message.role === 'user';
    
    // Function to format text with markdown-style formatting
    const formatText = (text: string) => {
        // Replace **text** with bold spans
        return text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    // Function to format message content with better layout
    const formatMessageContent = (content: string) => {
        // Split content into sections by double newlines
        const sections = content.split('\n\n').filter(Boolean);
        
        return sections.map((section, index) => {
            // Check if section starts with an emoji and title pattern (e.g., "🚗 Transportation")
            const titleMatch = section.match(/^([🚗🏠🌳🥗♻️🌿🌊💡🚶‍♂️🔋📱🛍️🌱🌍👋]\s+)?([^\n]+)/);
            const isList = section.includes('\n•') || section.includes('\n-') || section.includes('\n*');
            
            if (titleMatch && isList) {
                // It's a section with a title and list
                const [, emoji = '', title] = titleMatch;
                const listItems = section
                    .slice(titleMatch[0].length)
                    .split(/\n[•\-\*]\s*/)
                    .filter(Boolean);

                return (
                    <div key={index} className="space-y-2">
                        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            {emoji && <span>{emoji}</span>}
                            <span>{formatText(title)}</span>
                        </h3>
                        <ul className="list-disc list-inside space-y-1.5 ml-6">
                            {listItems.map((item, i) => (
                                <li key={i} className="text-gray-600 dark:text-gray-300">
                                    {formatText(item.trim())}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (titleMatch && !isList) {
                // It's just a title section
                return (
                    <h3 key={index} className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {titleMatch[1] && <span>{titleMatch[1]}</span>}
                        <span>{formatText(titleMatch[2])}</span>
                    </h3>
                );
            } else if (isList) {
                // It's just a list without title
                const items = section.split(/\n[•\-\*]\s*/).filter(Boolean);
                return (
                    <ul key={index} className="list-disc list-inside space-y-1.5 ml-6">
                        {items.map((item, i) => (
                            <li key={i} className="text-gray-600 dark:text-gray-300">
                                {formatText(item.trim())}
                            </li>
                        ))}
                    </ul>
                );
            } else {
                // Regular paragraph
                return (
                    <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {formatText(section)}
                    </p>
                );
            }
        });
    };

    return (
        <div className={cn(
            "py-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
            isUser ? "bg-white dark:bg-neutral-950" : "bg-gray-50/50 dark:bg-neutral-900/50"
        )}>
            <div className="max-w-4xl mx-auto px-4 flex gap-6">
                <div className="w-8 h-8 flex-shrink-0 mt-1">
                    {isUser ? (
                        <div className="bg-primary/10 dark:bg-primary/20 text-primary w-full h-full rounded-full flex items-center justify-center text-sm font-medium animate-in zoom-in duration-300">
                            U
                        </div>
                    ) : (
                        <div className="bg-green-100 dark:bg-green-900 w-full h-full rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                            <Leaf className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                    )}
                </div>
                <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {isUser ? "You" : "EcoChat"}
                    </p>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        {!isUser ? (
                            <div className="space-y-4">
                                {formatMessageContent(message.content)}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {message.content}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const SUGGESTED_PROMPTS = [
    {
        icon: <TreePine className="w-4 h-4 text-green-600 dark:text-green-400" />,
        text: "How can I reduce my carbon footprint?",
    },
    {
        icon: <Recycle className="w-4 h-4 text-green-600 dark:text-green-400" />,
        text: "What are the best recycling practices?",
    },
    {
        icon: <Droplets className="w-4 h-4 text-green-600 dark:text-green-400" />,
        text: "Tips for water conservation at home?",
    },
    {
        icon: <Wind className="w-4 h-4 text-green-600 dark:text-green-400" />,
        text: "Explain renewable energy options.",
    },
];

export function VercelV0Chat() {
    const { messages, isLoading, error, sendMessage } = useChat();
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 24,
        maxHeight: 200,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea || !textarea.value.trim() || isLoading) return;

        const content = textarea.value;
        textarea.value = "";
        adjustHeight(true);
        await sendMessage(content);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.form;
            if (form) form.requestSubmit();
        }
    };

    const handleSuggestedPrompt = async (prompt: string) => {
        if (isLoading) return;
        await sendMessage(prompt);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-neutral-950 animate-in fade-in duration-500">
            <div className="flex-1 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="space-y-12 max-w-2xl mx-auto px-4">
                            <div className="flex flex-col items-center gap-8">
                                <div 
                                    className="p-3 bg-green-100 dark:bg-green-900 rounded-full animate-in zoom-in duration-700 delay-200"
                                >
                                    <Leaf className="w-12 h-12 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                                    <h1 className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                        Welcome to EcoChat
                                    </h1>
                                    <p className="text-gray-700 dark:text-gray-300 text-lg max-w-md mx-auto">
                                        Your AI companion for sustainable living. Ask me about eco-friendly practices, climate action, and environmental solutions.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto w-full">
                                {SUGGESTED_PROMPTS.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestedPrompt(prompt.text)}
                                        disabled={isLoading}
                                        className={cn(
                                            "flex items-center gap-2 p-4",
                                            "bg-white hover:bg-gray-50 dark:bg-neutral-800/50 dark:hover:bg-neutral-800",
                                            "rounded-xl border border-gray-200 dark:border-neutral-800",
                                            "text-left text-sm text-gray-700 dark:text-gray-200",
                                            "transition-all duration-500",
                                            "disabled:opacity-50 disabled:cursor-not-allowed",
                                            "animate-in fade-in duration-700",
                                            "hover:scale-[1.02] hover:border-green-500/50 dark:hover:border-green-500/50",
                                            index % 2 === 0 ? "slide-in-from-left-8" : "slide-in-from-right-8"
                                        )}
                                        style={{
                                            animationDelay: `${500 + (Math.floor(index / 2) * 100)}ms`
                                        }}
                                    >
                                        <div className="text-green-600 dark:text-green-400">
                                            {prompt.icon}
                                        </div>
                                        <span>{prompt.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        {messages.map((message, index) => (
                            <ChatMessage key={index} message={message} />
                        ))}
                        {isLoading && (
                            <div className="py-6 bg-gray-50/50 dark:bg-neutral-900/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="max-w-4xl mx-auto px-4 flex gap-4 items-center">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-green-600 dark:text-green-400 animate-spin" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Thinking about sustainable solutions...</p>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="max-w-4xl mx-auto px-4 py-4">
                                <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-lg">
                                    {error}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
                    <Textarea
                        ref={textareaRef}
                        onChange={() => adjustHeight()}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about sustainable living..."
                        className={cn(
                            "w-full pr-12 py-3 px-4",
                            "resize-none",
                            "bg-gray-50 dark:bg-neutral-900",
                            "border border-gray-200 dark:border-neutral-800",
                            "rounded-xl",
                            "text-base",
                            "focus:outline-none",
                            "focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:ring-green-500/30 dark:focus:border-green-500",
                            "disabled:opacity-50",
                            "placeholder:text-gray-500 dark:placeholder:text-neutral-500"
                        )}
                        disabled={isLoading}
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        aria-label="Send message"
                        className={cn(
                            "absolute right-2 bottom-2.5",
                            "p-1.5 rounded-lg",
                            "text-green-600 dark:text-green-500",
                            "hover:text-green-700 dark:hover:text-green-400",
                            "transition-colors",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
} 