import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const OnboardingGate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const canEnterDashboard = sessionStorage.getItem("wq_enter_dashboard") === "1";
    const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isManualRefresh = navigationEntry?.type === "reload";

    if (canEnterDashboard) {
      sessionStorage.removeItem("wq_enter_dashboard");
      return;
    }

    if (isManualRefresh) {
      localStorage.removeItem("wq_onboarded");
      navigate("/welcome", { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
};
