import { NavLink } from "react-router-dom";
import { Home, Search, LayoutGrid, Mic, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/search", label: "Search", icon: Search },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/pronunciation", label: "Voice", icon: Mic },
  { to: "/about", label: "About", icon: Info },
];

export const BottomNav = () => (
  <nav className="sticky bottom-0 z-40 w-full border-t border-border bg-background/95 backdrop-blur-md pb-safe">
    <ul className="grid grid-cols-5 max-w-md mx-auto">
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
