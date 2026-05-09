import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-dvh flex flex-col bg-background">
    <div className="pt-safe">
      <Navbar />
    </div>
    <main className="flex-1 pb-2">{children}</main>
    <BottomNav />
  </div>
);
