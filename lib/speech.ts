/**
 * Text-to-Speech utility using Web Speech API
 */
export function speak(text: string, rate: number = 1.0): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("Speech synthesis not available");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Try to select a better voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (voice) =>
      (voice.name.includes("Google") && voice.name.includes("US English")) ||
      (voice.name.includes("Zira") && voice.name.includes("English")) ||
      (voice.lang.includes("en") && voice.name.includes("Female"))
  ) || voices.find((voice) => voice.lang.includes("en-US"));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.rate = rate; // Keep the requested rate
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}

// Pre-load voices to ensure they are available when needed
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
