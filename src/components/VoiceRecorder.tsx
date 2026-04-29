import { Mic, Square, Play, Trash2, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveRecording, getRecording, deleteRecording } from "@/lib/recordings";

export const VoiceRecorder = ({ wordKey, label = "My Voice" }: { wordKey: string; label?: string }) => {
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    getRecording(wordKey).then((b) => setHasRecording(!!b));
  }, [wordKey]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await saveRecording(wordKey, blob);
        setHasRecording(true);
        stream.getTracks().forEach((t) => t.stop());
        toast.success("Saved! Your voice is ready to play.");
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (err) {
      toast.error("Microphone access denied. Please allow it in your browser.");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const play = async () => {
    const blob = await getRecording(wordKey);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlaying(true);
    audio.onended = () => { setPlaying(false); URL.revokeObjectURL(url); };
    audio.play();
  };

  const remove = async () => {
    await deleteRecording(wordKey);
    setHasRecording(false);
    toast.success("Recording deleted.");
  };

  if (recording) {
    return (
      <button onClick={stopRecording} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-destructive text-destructive-foreground hover:opacity-90 transition-smooth animate-pulse">
        <Square className="w-4 h-4 fill-current" /> Stop recording
      </button>
    );
  }

  if (hasRecording) {
    return (
      <div className="inline-flex items-center gap-2">
        <button onClick={play} disabled={playing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-smooth">
          <Volume2 className="w-4 h-4" /> {playing ? "Playing…" : `Listen (${label})`}
        </button>
        <button onClick={startRecording} title="Re-record" className="grid place-items-center w-10 h-10 rounded-full bg-secondary hover:bg-muted transition-smooth">
          <Mic className="w-4 h-4" />
        </button>
        <button onClick={remove} title="Delete recording" className="grid place-items-center w-10 h-10 rounded-full bg-secondary hover:bg-destructive hover:text-destructive-foreground transition-smooth">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button onClick={startRecording} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-smooth border border-dashed border-border">
      <Mic className="w-4 h-4" /> Record my voice
    </button>
  );
};
