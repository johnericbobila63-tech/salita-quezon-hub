import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background px-6 py-16">
      <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-up">
        <img
          src={logo}
          alt="Wikang Quezon logo"
          width={180}
          height={180}
          className="w-44 h-44 mb-8 animate-float drop-shadow-xl"
        />
        <h1 className="font-display text-5xl md:text-6xl font-semibold text-primary mb-3">
          Wikang Quezon
        </h1>
        <p className="text-muted-foreground text-lg max-w-sm">
          Diksyunaryo ng Lalawigan ng Quezon
        </p>
      </div>
      <Link
        to="/onboarding/purpose"
        className="w-full max-w-md text-center py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg shadow-soft hover:bg-primary-glow transition-smooth"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Welcome;
