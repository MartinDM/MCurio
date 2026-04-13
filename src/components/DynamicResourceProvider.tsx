import React, { useMemo } from "react";
import { Refine } from "@refinedev/core";
import { useOnboarding } from "@/hooks/useOnboarding";
import { getResourcesForPlan } from "@/config/resources";

interface DynamicResourceProviderProps {
  children: React.ReactNode;
  refineProps: any; // All other Refine props
}

export const DynamicResourceProvider: React.FC<
  DynamicResourceProviderProps
> = ({ children, refineProps }) => {
  const { museum, loading } = useOnboarding();

  const resources = useMemo(() => {
    if (loading) return getResourcesForPlan("personal"); // Default while loading
    return getResourcesForPlan(museum?.plan_type || "personal");
  }, [museum?.plan_type, loading]);

  return (
    <Refine {...refineProps} resources={resources}>
      {children}
    </Refine>
  );
};
