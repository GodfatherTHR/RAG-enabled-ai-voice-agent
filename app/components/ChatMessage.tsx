interface ChatMessageProps {
  role: "user" | "assistant";
  text: string;
}

import { stopSpeaking } from "@/lib/speech";

export function ChatMessage({ role, text }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 group`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-2xl shadow-sm relative ${isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>

        {!isUser && (
          <button
            onClick={() => stopSpeaking()}
            className="absolute -bottom-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Stop speaking"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
