import { useOnboarding } from "./useOnboarding";

export interface PlanAccess {
  canAccessLoans: boolean;
  canAccessExhibitions: boolean;
  canAccessConditionReports: boolean;
  isMuseumPlan: boolean;
  isPersonalPlan: boolean;
}

export const usePlanAccess = (): PlanAccess => {
  const { museum } = useOnboarding();

  const planType = museum?.plan_type || "personal";
  const isMuseumPlan = planType === "museum";
  const isPersonalPlan = planType === "personal";

  return {
    canAccessLoans: isMuseumPlan,
    canAccessExhibitions: isMuseumPlan,
    canAccessConditionReports: isMuseumPlan,
    isMuseumPlan,
    isPersonalPlan,
  };
};
