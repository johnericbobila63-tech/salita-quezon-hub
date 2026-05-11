import { NavLink } from "react-router-dom";
import { Home, Search, LayoutGrid, Bookmark, Mic, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/search", label: "Search", icon: Search },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/pronunciation", label: "Voice", icon: Mic },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export const BottomNav = () => (
  <nav className="sticky bottom-0 z-40 w-full border-t border-border bg-background/95 backdrop-blur-md pb-safe">
    <ul className="grid grid-cols-6 max-w-md mx-auto">
      {tabs.map((t) => (
        <li key={t.to}>
          <NavLink
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-smooth",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <t.icon className="w-5 h-5" />
            <span>{t.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);
