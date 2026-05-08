import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const OnboardingGate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("wq_onboarded")) {
      navigate("/welcome", { replace: true });
    }
  }, [navigate]);
  return <>{children}</>;
};
