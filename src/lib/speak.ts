export const speak = (text: string, voice?: "male" | "female") => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fil-PH";
  utter.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const filVoices = voices.filter((v) => v.lang.startsWith("fil") || v.lang.startsWith("tl"));
  if (filVoices.length) {
    if (voice === "male") utter.voice = filVoices.find((v) => /male/i.test(v.name)) || filVoices[0];
    else if (voice === "female") utter.voice = filVoices.find((v) => /female/i.test(v.name)) || filVoices[0];
    else utter.voice = filVoices[0];
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
};
