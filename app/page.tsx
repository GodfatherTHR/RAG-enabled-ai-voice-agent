"use client";

import { useState, useRef, useEffect } from "react";
import { MicButton } from "./components/MicButton";
import { ChatMessage } from "./components/ChatMessage";
import { LoadingDots } from "./components/LoadingDots";
import { speak, stopSpeaking } from "@/lib/speech";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", text: text.trim() };
    setMessages((m) => [...m, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        text: data.reply,
      };

      setMessages((m) => [...m, assistantMessage]);

      // Speak the response
      speak(data.reply);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((m) => [...m, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  }

  function clearChat() {
    setMessages([]);
    stopSpeaking();
  }

  return (
    <main className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              🤖 AI Voice Assistant
            </h1>
            <p className="text-sm text-gray-500">
              Powered by Gemini AI & Supabase RAG
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Chat
            </button>
          )}
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-2">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👋</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Welcome to AI Voice Assistant
              </h2>
              <p className="text-gray-500">
                Click the microphone or type a message to get started
              </p>
            </div>
          ) : (
            messages.map((m, i) => <ChatMessage key={i} {...m} />)
          )}
          {isLoading && <LoadingDots />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Text Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Send
            </button>
          </div>

          {/* Voice Input */}
          <div className="flex justify-center">
            <MicButton onFinalText={sendMessage} />
          </div>
        </div>
      </div>
    </main>
  );
}
