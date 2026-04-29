import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="mt-24 border-t border-border bg-secondary/40">
    <div className="container py-12 grid gap-8 md:grid-cols-3">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Leaf className="w-4 h-4" />
          </span>
          <span className="font-display text-lg font-semibold">Wikang Quezon</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">
          Pinapanatili ang wika at kultura ng Lalawigan ng Quezon — isang salita sa bawat araw.
        </p>
      </div>
      <div>
        <h4 className="font-display text-sm font-semibold mb-3">Explore</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
          <li><Link to="/pronunciation" className="hover:text-primary">Pronunciation Library</Link></li>
          <li><Link to="/submit" className="hover:text-primary">Submit a Word</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-sm font-semibold mb-3">About</h4>
        <p className="text-sm text-muted-foreground">
          A community-driven heritage project celebrating the Tagalog dialect of Quezon Province.
        </p>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-4 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} Wikang Quezon · Para sa pagpapanatili ng ating wika
      </div>
    </div>
  </footer>
);
