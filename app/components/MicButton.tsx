"use client";

import { useState } from "react";

interface MicButtonProps {
  onFinalText: (text: string) => void;
}

export function MicButton({ onFinalText }: MicButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  function startListening() {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        onFinalText(finalTranscript.trim());
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "no-speech") {
        alert("No speech detected. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className={`p-6 rounded-full text-white text-4xl transition-all ${
          isListening
            ? "bg-red-500 animate-pulse"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={startListening}
        disabled={isListening}
      >
        {isListening ? "🎙️" : "🎤"}
      </button>
      {isListening && (
        <p className="text-sm text-gray-600">Listening...</p>
      )}
      {transcript && (
        <p className="text-sm text-gray-500 italic">"{transcript}"</p>
      )}
    </div>
  );
}
