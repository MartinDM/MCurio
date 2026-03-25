import { useList } from "@refinedev/core";

import { Col, Row } from "antd";

import {
  CalendarUpcomingEvents,
  DashboardDealsChart,
  DashboardLatestActivities,
  DashboardTotalCountCard,
} from "./components";

export const DashboardPage = () => {
  const { data: itemsData, isLoading: itemsLoading } = useList({
    resource: "items",
    pagination: { current: 1, pageSize: 1 },
  });

  const { data: exhibitionsData, isLoading: exhibitionsLoading } = useList({
    resource: "exhibitions",
    pagination: { current: 1, pageSize: 1 },
  });

  const { data: museumsData, isLoading: museumsLoading } = useList({
    resource: "museums",
    pagination: { current: 1, pageSize: 1 },
  });

  return (
    <div className="page-container">
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
