import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Chat - Powered by Custom Fine-Tuned Model",
    description: "Chat with an AI trained on custom content",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full">
            <body
                className={`${inter.className} h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900`}
                suppressHydrationWarning={true}
            >
                {children}
            </body>
        </html>
    );
}
