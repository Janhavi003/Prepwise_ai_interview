export const speakText = (text: string) => {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  speechSynthesis.cancel();
};

// ===============================
// SPEECH TO TEXT
// ===============================
export const createRecognition = () => {
  const SpeechRecognition =
    (window as any).webkitSpeechRecognition ||
    (window as any).SpeechRecognition;

  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;

  return recognition;
};