import React from "react";
import { Authenticated } from "@refinedev/core";
import { CatchAllNavigate } from "@refinedev/react-router";
import { Spin } from "antd";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Navigate } from "react-router";

interface AuthenticationWrapperProps {
  children: React.ReactNode;
}

export const AuthenticationWrapper: React.FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  return (
    <Authenticated
      key="authenticated-layout"
      fallback={<CatchAllNavigate to="/login" />}
      loading={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <OnboardingStateWrapper>{children}</OnboardingStateWrapper>
    </Authenticated>
  );
};

const OnboardingStateWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { needsOnboarding, loading } = useOnboarding();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default AuthenticationWrapper;
