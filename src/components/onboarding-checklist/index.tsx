import React from "react";
import { Card, List, Typography, Button, Badge, Space } from "antd";
import {
  CheckCircleOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;

interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface OnboardingChecklistProps {
  museumType: "personal" | "museum" | "organisation" | "conservator";
  steps: Array<{
    step_name: string;
    completed: boolean;
  }>;
}

const getStepsForType = (type: string): Omit<OnboardingStep, "completed">[] => {
  const baseSteps = [
    {
      key: "add_first_item",
      path: "/items/create",
      icon: <PlusOutlined />,
    },
    {
      key: "add_first_contact",
      path: "/contacts/create",
      icon: <UsergroupAddOutlined />,
    },
    {
      key: "create_exhibition",
      path: "/exhibitions/create",
      icon: <CalendarOutlined />,
    },
  ];

  switch (type) {
    case "personal":
      return [
        {
          ...baseSteps[0],
          title: "Add your first item",
          description: "Start cataloguing pieces in your collection",
        },
        {
          ...baseSteps[1],
          title: "Add a contact",
          description: "Add artists, dealers, or appraisers you work with",
        },
        {
          ...baseSteps[2],
          title: "Plan a display",
          description: "Organize your collection for home display or loan",
        },
      ];

    case "museum":
      return [
        {
          ...baseSteps[0],
          title: "Add your first artifact",
          description: "Begin cataloguing your institutional collection",
        },
        {
          ...baseSteps[1],
          title: "Add institutional contacts",
          description: "Add curators, lenders, researchers, and partners",
        },
        {
          ...baseSteps[2],
          title: "Create an exhibition",
          description: "Plan your next public exhibition",
        },
      ];

    case "organisation":
      return [
        {
          ...baseSteps[0],
          title: "Add your first item",
          description: "Start managing your organisation's collection",
        },
        {
          ...baseSteps[1],
          title: "Add team members",
          description: "Add staff, volunteers, and external partners",
        },
        {
          ...baseSteps[2],
          title: "Plan an event",
          description: "Organize exhibitions, shows, or community events",
        },
      ];

    case "conservator":
      return [
        {
          ...baseSteps[0],
          title: "Add your first client item",
          description: "Begin documenting conservation projects",
        },
        {
          ...baseSteps[1],
          title: "Add clients",
          description: "Manage relationships with collectors and institutions",
        },
        {
          ...baseSteps[2],
          title: "Document a treatment",
          description: "Create conservation documentation and reports",
        },
      ];

    default:
      return [
        {
          ...baseSteps[0],
          title: "Add your first item",
          description: "Start building your collection database",
        },
        {
          ...baseSteps[1],
          title: "Add contacts",
          description: "Build your network of people and institutions",
        },
        {
          ...baseSteps[2],
          title: "Create an event",
          description: "Plan exhibitions, loans, or other activities",
        },
      ];
  }
};

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  museumType,
  steps,
}) => {
  const navigate = useNavigate();
  const stepData = getStepsForType(museumType);

  // Merge step completion status with step definitions
  const checklist: OnboardingStep[] = stepData.map((step) => ({
    ...step,
    completed: steps.find((s) => s.step_name === step.key)?.completed || false,
  }));

  const completedCount = checklist.filter((step) => step.completed).length;
  const allCompleted = completedCount === checklist.length;

  const handleStepClick = (step: OnboardingStep) => {
    navigate(step.path);
  };

  return (
    <Card
      style={{ marginBottom: 24 }}
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Get Started Checklist
          </Title>
          <Badge
            count={`${completedCount}/${checklist.length}`}
            style={{ backgroundColor: allCompleted ? "#52c41a" : "#1890ff" }}
          />
        </Space>
      }
    >
      {allCompleted && (
        <div
          style={{
            background: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: 6,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#52c41a", fontWeight: 500 }}>
            🎉 Congratulations! You've completed the initial setup. Your
            collection management system is ready to use.
          </Text>
        </div>
      )}

      <List
        dataSource={checklist}
        renderItem={(step) => (
          <List.Item
            actions={[
              <Button
                type={step.completed ? "default" : "primary"}
                size="small"
                onClick={() => handleStepClick(step)}
                icon={step.completed ? <CheckCircleOutlined /> : step.icon}
              >
                {step.completed ? "View" : "Start"}
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <div
                  style={{
                    color: step.completed ? "#52c41a" : "#1890ff",
                    fontSize: 18,
                  }}
                >
                  {step.completed ? <CheckCircleOutlined /> : step.icon}
                </div>
              }
              title={
                <span
                  style={{
                    textDecoration: step.completed ? "line-through" : "none",
                    color: step.completed ? "#999" : "inherit",
                  }}
                >
                  {step.title}
                </span>
              }
              description={step.description}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default OnboardingChecklist;
