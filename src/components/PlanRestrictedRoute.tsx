import React from "react";
import { Navigate } from "react-router";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { Result, Button } from "antd";
import { Link } from "react-router";

interface PlanRestrictedRouteProps {
  children: React.ReactNode;
  requiredFeature: "exhibitions" | "loans" | "conditionReports";
  featureName: string;
}

export const PlanRestrictedRoute: React.FC<PlanRestrictedRouteProps> = ({
  children,
  requiredFeature,
  featureName,
}) => {
  const {
    canAccessExhibitions,
    canAccessLoans,
    canAccessConditionReports,
    isPersonalPlan,
  } = usePlanAccess();

  const hasAccess = {
    exhibitions: canAccessExhibitions,
    loans: canAccessLoans,
    conditionReports: canAccessConditionReports,
  }[requiredFeature];

  if (!hasAccess) {
    return (
      <Result
        status="403"
        title="Museum Plan Required"
        subTitle={`${featureName} are only available with the Museum plan. Upgrade your plan to access this feature.`}
        extra={
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <Link to="/settings">
              <Button type="primary">Upgrade Plan</Button>
            </Link>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        }
      />
    );
  }

  return <>{children}</>;
};
