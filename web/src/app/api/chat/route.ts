// web/app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        const { messages } = body;

        // Validate messages
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid request format" },
                { status: 400 }
            );
        }

        // Convert UI messages to model messages using AI SDK utility
        const modelMessages = convertToModelMessages(messages);

        // Check if we have any valid messages
        if (modelMessages.length === 0) {
            return NextResponse.json(
                { error: "No valid messages provided" },
                { status: 400 }
            );
        }

        // Add system prompt to prevent hallucination and guide the model
        const systemPrompt = {
            role: "system" as const,
            content: `You are a helpful assistant answering questions about MTechZilla, a software development company. 

IMPORTANT INSTRUCTIONS:
- Only answer questions based on information you were specifically trained on about MTechZilla
- If you don't know something or weren't trained on specific information, say "I don't have that specific information in my training data"
- Never make up or guess information about MTechZilla
- Be accurate and only provide information you're confident about

Answer questions accurately based on your training data about MTechZilla's services, technologies, and approach.`
        };

        // Prepend system message if not already present
        const hasSystemMessage = modelMessages.some(msg => msg.role === 'system');
        if (!hasSystemMessage) {
            modelMessages.unshift(systemPrompt);
        }

        // Load fine-tuned model ID from environment variable
        const fineTunedModelId = process.env.FINE_TUNED_MODEL;

        // Ensure we have a valid model ID
        if (!fineTunedModelId) {
            throw new Error("No fine-tuned model ID available");
        }

        // Call OpenAI with streaming using the new AI SDK
        const result = streamText({
            model: openai(fineTunedModelId),
            messages: modelMessages,
            temperature: 0.1, // Lower temperature for more deterministic, factual responses
        });

        // Log stream start
        console.log(`Stream started`);

        // Return UI message stream response for useChat compatibility
        return result.toUIMessageStreamResponse({
            headers: {
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
            },
        });
    } catch (error: unknown) {
        console.error("Chat API Error:", error);

        // Handle specific errors
        if (error && typeof error === "object" && "status" in error) {
            const errorWithStatus = error as { status: number };

            if (errorWithStatus.status === 401) {
                return NextResponse.json(
                    {
                        error: "Authentication failed. Check API key configuration.",
                    },
                    { status: 401 }
                );
            }

            if (errorWithStatus.status === 404) {
                return NextResponse.json(
                    {
                        error: "Model not found. Check your fine-tuned model ID.",
                    },
                    { status: 404 }
                );
            }

            if (errorWithStatus.status === 429) {
                return NextResponse.json(
                    {
                        error: "OpenAI rate limit reached. Please try again later.",
                    },
                    { status: 429 }
                );
            }
        }

        // Generic error
        return NextResponse.json(
            { error: "An error occurred. Please try again." },
            { status: 500 }
        );
    }
}
