export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt?: Date;
}

export interface ChatRequest {
    messages: Message[];
    model?: string;
}

export interface ChatResponse {
    message: Message;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
