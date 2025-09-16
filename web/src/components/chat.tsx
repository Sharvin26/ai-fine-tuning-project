// web/src/components/chat.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function Chat() {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState("");

    const {
        messages,
        sendMessage,
        status,
        error,
        regenerate,
        stop,
        setMessages,
    } = useChat({
        onError: (error) => {
            console.error("Chat error:", error);
        },
        onFinish: () => {
            inputRef.current?.focus();
        },
    });

    const isLoading = status === "streaming" || status === "submitted";

    // Add welcome message on mount
    useEffect(() => {
        if (messages.length === 0) {
            setMessages((prev) => [
                ...prev,
                {
                    id: "welcome",
                    role: "assistant" as const,
                    parts: [
                        {
                            type: "text" as const,
                            text: "Hello! I'm your custom AI assistant, trained on specific content. How can I help you today?",
                        },
                    ],
                },
            ]);
        }
    }, [messages.length, setMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        
        sendMessage({
            role: "user",
            parts: [{ type: "text", text: input }],
        });
        setInput("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector(
                "[data-radix-scroll-area-viewport]"
            );
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);


    return (
        <div className="flex h-screen max-w-5xl mx-auto p-4">
            <Card className="flex-1 flex flex-col shadow-xl overflow-hidden">
                {/* Header */}
                <CardHeader className="border-b flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>Custom AI Assistant</CardTitle>
                            <CardDescription>
                                Powered by your fine-tuned model
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                {/* Messages Area */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0">
                    <div className="p-4 space-y-4 pb-4">
                        {messages.map((message) => {
                            const isUser = (message.role as string) === "user";
                            return (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex",
                                        isUser ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex items-start gap-3 max-w-[85%] min-w-0",
                                            isUser && "flex-row-reverse"
                                        )}
                                    >
                                        {/* Avatar */}
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarFallback
                                                className={cn(
                                                    isUser
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                )}
                                            >
                                                {isUser ? (
                                                    <User className="h-4 w-4" />
                                                ) : (
                                                    <Bot className="h-4 w-4" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Message Content */}
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div
                                                className={cn(
                                                    "rounded-lg px-4 py-2.5 text-sm max-w-full",
                                                    isUser
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                )}
                                            >
                                                <div className="whitespace-pre-wrap break-words leading-relaxed overflow-wrap-anywhere">
                                                    {message.parts?.map((part, index) => {
                                                        if (part.type === "text") {
                                                            return <p key={index}>{part.text}</p>;
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-3 max-w-[85%]">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-muted">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted rounded-lg px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            <span className="text-sm text-muted-foreground">
                                                Thinking...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="flex justify-center px-4">
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 max-w-md">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm text-destructive">
                                                {error.message ||
                                                    "Something went wrong. Please try again."}
                                            </p>
                                            <Button
                                                onClick={() => regenerate()}
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs"
                                            >
                                                Retry last message
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <CardContent className="border-t p-4 flex-shrink-0">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className={cn(
                                "flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background",
                                "placeholder:text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                "disabled:cursor-not-allowed disabled:opacity-50"
                            )}
                            autoFocus
                        />

                        {isLoading ? (
                            <Button
                                type="button"
                                onClick={stop}
                                variant="destructive"
                                size="sm"
                            >
                                Stop
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={!input.trim()}
                                size="sm"
                            >
                                <Send className="h-4 w-4" />
                                <span className="ml-2 hidden sm:inline">
                                    Send
                                </span>
                            </Button>
                        )}
                    </form>

                    {/* Character Counter */}
                    {input.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground text-right">
                            {input.length} / 4000
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}