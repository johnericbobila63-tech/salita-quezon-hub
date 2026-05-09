import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import hero from "@/assets/hero-quezon.jpg";

const Welcome = () => {
  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-between px-6 pt-safe pb-safe overflow-hidden">
      <div className="h-12" />
      <div className="absolute inset-0 -z-10">
        <img
          src={hero}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-up">
        <img
          src={logo}
          alt="Wikang Quezon logo"
          width={180}
          height={180}
          className="w-44 h-44 mb-8 animate-float drop-shadow-2xl"
        />
        <h1 className="font-display text-5xl md:text-6xl font-semibold text-primary-foreground mb-3">
          Wikang Quezon
        </h1>
        <p className="text-primary-foreground/85 text-lg max-w-sm">
          Diksyunaryo ng Lalawigan ng Quezon
        </p>
      </div>
      <Link
        to="/onboarding/purpose"
        className="w-full max-w-md text-center py-4 mb-6 rounded-2xl bg-saffron text-saffron-foreground font-semibold text-lg shadow-warm active:scale-[0.98] hover:opacity-90 transition-smooth"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Welcome;
