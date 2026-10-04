import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

export const GameFab = () => (
  <Link to="/quest" aria-label="Play Quezon Quest"
    className="fixed right-4 bottom-20 z-40 grid place-items-center w-14 h-14 rounded-full bg-ocean text-ocean-foreground shadow-warm hover:scale-105 active:scale-95 transition-smooth">
    <Gamepad2 className="w-6 h-6" />
  </Link>
);
