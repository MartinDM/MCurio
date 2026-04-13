import React from "react";
import { Tag, Typography } from "antd";
import { ClockCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { useOnboarding } from "@/hooks/useOnboarding";

const { Text } = Typography;

export const TrialCountdown: React.FC = () => {
  const { trialStatus, loading } = useOnboarding();

  if (loading || !trialStatus) {
    return null;
  }

  const { daysRemaining, trialExpired, trialEndsAt, itemsUsed, itemLimit } =
    trialStatus;

  if (trialExpired) {
    return (
      <div style={{ padding: "8px 16px", borderBottom: "1px solid #f0f0f0" }}>
        <Tag
          icon={<WarningOutlined />}
          color="red"
          style={{ width: "100%", textAlign: "center" }}
        >
          Trial Expired
        </Tag>
      </div>
    );
  }

  const endDate = new Date(trialEndsAt).toLocaleDateString();
  const isLastDay = daysRemaining <= 1;
  const tagColor = isLastDay ? "red" : daysRemaining <= 3 ? "orange" : "blue";

  return (
    <div style={{ padding: "8px 16px", borderBottom: "1px solid #f0f0f0" }}>
      <Tag
        icon={<ClockCircleOutlined />}
        color={tagColor}
        style={{ width: "100%", textAlign: "center" }}
      >
        {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
      </Tag>
      <Text
        type="secondary"
        style={{
          fontSize: "11px",
          display: "block",
          textAlign: "center",
          marginTop: "4px",
        }}
      >
        Ends {endDate}
      </Text>
      <Text
        type="secondary"
        style={{
          fontSize: "11px",
          display: "block",
          textAlign: "center",
          marginTop: "2px",
        }}
      >
        {itemsUsed}/{itemLimit} items
      </Text>
    </div>
  );
};
