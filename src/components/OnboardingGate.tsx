import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Module-level flag: resets on full page refresh, persists across in-app navigation.
let hasRedirectedThisSession = false;

export const OnboardingGate = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const isFreshPageLoad = location.key === "default";
    if (typeof window !== "undefined" && isFreshPageLoad && !hasRedirectedThisSession) {
      hasRedirectedThisSession = true;
      localStorage.removeItem("wq_onboarded");
      navigate("/welcome", { replace: true });
    }
  }, [location.key, navigate]);
  return <>{children}</>;
};
