import React from "react";
import { useList } from "@refinedev/core";

import { Col, Row } from "antd";

import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import {
  CalendarUpcomingEvents,
  DashboardDealsChart,
  DashboardLatestActivities,
  DashboardTotalCountCard,
} from "./components";

export const DashboardPage = () => {
  const { museum, steps, checkAndCompleteSteps } = useOnboarding();

  const { data: itemsData, isLoading: itemsLoading } = useList({
    resource: "items",
    pagination: { current: 1, pageSize: 1 },
  });

  const { data: exhibitionsData, isLoading: exhibitionsLoading } = useList({
    resource: "exhibitions",
    pagination: { current: 1, pageSize: 1 },
  });

  const { data: contactsData, isLoading: contactsLoading } = useList({
    resource: "contacts",
    pagination: { current: 1, pageSize: 1 },
  });

  const { data: museumsData, isLoading: museumsLoading } = useList({
    resource: "museums",
    pagination: { current: 1, pageSize: 1 },
  });

  // Auto-check and complete onboarding steps when component mounts or data changes
  React.useEffect(() => {
    checkAndCompleteSteps();
  }, []);

  // Also check when data counts change (user adds/removes items)
  React.useEffect(() => {
    if (!itemsLoading && !exhibitionsLoading && !contactsLoading && museum) {
      // Small delay to allow UI to update before checking
      const timeoutId = setTimeout(() => {
        checkAndCompleteSteps();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [
    itemsData?.total,
    exhibitionsData?.total,
    contactsData?.total,
    itemsLoading,
    exhibitionsLoading,
    contactsLoading,
    museum,
  ]);

  return (
    <div className="page-container">
      {/* Show onboarding checklist if not completed */}
      {museum && !museum.onboarding_completed && (
        <Row style={{ marginBottom: 32 }}>
          <Col xs={24}>
            <OnboardingChecklist museumType={museum.type} steps={steps} />
          </Col>
        </Row>
      )}

      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="items"
            isLoading={itemsLoading}
            totalCount={itemsData?.total}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="exhibitions"
            isLoading={exhibitionsLoading}
            totalCount={exhibitionsData?.total}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="museums"
            isLoading={museumsLoading}
            totalCount={museumsData?.total}
          />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col
          xs={24}
          sm={24}
          xl={8}
          style={{
            height: "460px",
          }}
        >
          <CalendarUpcomingEvents />
        </Col>
        <Col
          xs={24}
          sm={24}
          xl={16}
          style={{
            height: "460px",
          }}
        >
          <DashboardDealsChart />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col xs={24}>
          <DashboardLatestActivities />
        </Col>
      </Row>
    </div>
  );
};
