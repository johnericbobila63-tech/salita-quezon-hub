import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Module-level flag: resets on full page refresh, persists across in-app navigation.
let hasRedirectedThisSession = false;

export const OnboardingGate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined" && !hasRedirectedThisSession) {
      hasRedirectedThisSession = true;
      localStorage.removeItem("wq_onboarded");
      navigate("/welcome", { replace: true });
    }
  }, [navigate]);
  return <>{children}</>;
};
