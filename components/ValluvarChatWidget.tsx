"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithValluvar, ChatMessage } from "@/app/actions/chat-with-valluvar";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function ValluvarChatWidget() {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
                // Optional: close if clicking outside, but usually chat widgets stay open until explicitly closed. 
                // Commenting out for better UX, usually users toggle with the button.
                // setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);


    const handleSubmit = async (e: React.FormEvent | null, specificQuestion?: string) => {
        if (e) e.preventDefault();

        const questionToAsk = specificQuestion || input.trim();
        if (!questionToAsk || isLoading) return;

        setInput("");

        // Optimistic update
        const newMessages: ChatMessage[] = [
            ...messages,
            { role: "user", content: questionToAsk }
        ];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await chatWithValluvar(messages, questionToAsk, language);
            setMessages([
                ...newMessages,
                { role: "model", content: response }
            ]);
        } catch (error) {
            console.error("Failed to chat:", error);
            setMessages([
                ...newMessages,
                { role: "model", content: "My friend, the connection is weak. Please try again." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={chatContainerRef}>
            {/* Chat Window */}
            <div
                className={`
                    w-[90vw] md:w-[400px] h-[500px] max-h-[80vh] 
                    bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col
                    transition-all duration-300 origin-bottom-right
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none absolute bottom-0 right-0'}
                `}
            >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-amber-500/10 to-fuchsia-600/10 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-fuchsia-600 rounded-full blur opacity-40"></div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="Valluvar" className="relative w-8 h-8 rounded-full border border-white/20" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 leading-none">
                                {language === 'ta' ? 'வள்ளுவர்' : 'Valluvar AI'}
                            </h3>
                            <span className="text-xs text-green-500 font-medium flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-black/20">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col justify-center">
                            <div className="text-center p-4">
                                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                                    {language === 'ta' ? 'இன்றைய பிரச்சனைகளுக்கு குறள் வழி தீர்வு.' : 'Ancient wisdom for modern problems.'}
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                    {(language === 'ta' ? [
                                        "வேலையில் ஒரே அழுத்தம்...",
                                        "செல்வம் சேர்ப்பது எப்படி?",
                                        "நட்பில் விரிசல், என்ன செய்ய?"
                                    ] : [
                                        "I'm feeling stressed at work.",
                                        "How to find peace?",
                                        "Advice on leadership."
                                    ]).map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSubmit(null, q)}
                                            className="text-xs text-left p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-white/10 rounded-bl-none'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={(e) => handleSubmit(e)} className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-white/5">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={language === 'ta' ? 'கேளுங்கள்...' : 'Ask Valluvar...'}
                            className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all outline-none"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative mt-4 h-14 w-14 rounded-full bg-gradient-to-r from-amber-500 to-fuchsia-600 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Chat" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />

                    {/* Tooltip hint */}
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white dark:bg-slate-800 text-gray-800 dark:text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 pointer-events-none">
                        {language === 'ta' ? 'வள்ளுவரிடம் கேளுங்கள்' : 'Chat with Valluvar'}
                    </span>
                </button>
            )}

            {/* Close Button when open - optionally separate or integrated into header. 
                Since we have a close X in the header, we don't need another button here, 
                and the FAB disappears when open to make room for the window.
            */}
        </div>
    );
}

