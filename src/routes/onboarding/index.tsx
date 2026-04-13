import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  Alert,
  Tooltip,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "@/lib/supabase";

const { Title, Text } = Typography;

interface OnboardingFormValues {
  museumName: string;
  museumType: "personal" | "museum" | "organisation" | "conservator";
}

const museumTypeOptions = [
  {
    value: "personal",
    label: "Personal Collection",
    description: "Individual collector managing personal items",
  },
  {
    value: "museum",
    label: "Museum",
    description: "Cultural institution with public collections",
  },
  {
    value: "organisation",
    label: "Organisation",
    description: "Cultural organisation or gallery",
  },
  {
    value: "conservator",
    label: "Conservator",
    description: "Conservation professional managing treatments",
  },
];

const TYPE_LABELS = {
  personal: {
    welcome: "Welcome to your collection management system",
    setup: "Set up your personal collection",
    nameLabel: "Collection name",
    namePlaceholder: "My Art Collection",
  },
  museum: {
    welcome: "Welcome to your museum management system",
    setup: "Set up your museum",
    nameLabel: "Museum name",
    namePlaceholder: "Museum of Fine Arts",
  },
  organisation: {
    welcome: "Welcome to your organisation management system",
    setup: "Set up your organisation",
    nameLabel: "Organisation name",
    namePlaceholder: "Cultural Arts Center",
  },
  conservator: {
    welcome: "Welcome to your conservation management system",
    setup: "Set up your conservation practice",
    nameLabel: "Practice name",
    namePlaceholder: "Professional Conservation Services",
  },
} as const;

const getTypeLabels = (type: string) => {
  return (
    TYPE_LABELS[type as keyof typeof TYPE_LABELS] || {
      welcome: "Welcome to MCurio",
      setup: "Set up your organisation",
      nameLabel: "Name",
      namePlaceholder: "Enter name",
    }
  );
};

export const OnboardingFlow: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("museum");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get the plan from URL parameters and map to museum type
  const planParam = searchParams.get("plan");
  const getInitialType = () => {
    switch (planParam) {
      case "personal":
        return "personal";
      case "museum":
        return "museum";
      default:
        return "museum"; // Default to museum if no plan specified
    }
  };

  // Initialize the selected type and form values based on the plan parameter
  useEffect(() => {
    const initialType = getInitialType();
    setSelectedType(initialType);
    form.setFieldsValue({ museumType: initialType });
  }, [planParam, form]);

  const labels = getTypeLabels(selectedType);

  const handleSubmit = async (values: OnboardingFormValues) => {
    setLoading(true);
    try {
      // Call our custom function to create museum and profile
      const { data, error } = await supabase.rpc("create_museum_with_profile", {
        museum_name: values.museumName,
        museum_type: values.museumType,
      });

      if (error) {
        throw error;
      }

      // Navigate to dashboard after successful creation
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Error creating museum:", error);
      // Handle error - could show notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        background: "#f5f5f5",
      }}
    >
      <Card
        style={{ width: "100%", maxWidth: 600 }}
        title={
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              MCurio
            </Title>
            <Text type="secondary">{labels.welcome}</Text>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ museumType: getInitialType() }}
        >
          <Title level={4}>{labels.setup}</Title>

          {planParam && (
            <Alert
              message={`${
                planParam === "personal" ? "Personal" : "Museum"
              } Plan Selected`}
              description={`You're setting up a ${
                planParam === "personal"
                  ? "personal collection"
                  : "museum or institution"
              }. You can change this below if needed.`}
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
              closable
            />
          )}

          <Form.Item
            name="museumType"
            label={
              <Space>
                What type of organisation are you?
                <Tooltip title="The user experience will be adjusted to best suit your workflow for this organisation type">
                  <InfoCircleOutlined
                    style={{ color: "#1890ff", cursor: "pointer" }}
                  />
                </Tooltip>
              </Space>
            }
            rules={[
              {
                required: true,
                message: "Please select your organisation type",
              },
            ]}
          >
            <Select
              size="large"
              onChange={setSelectedType}
              optionLabelProp="label"
            >
              {museumTypeOptions.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  label={option.label}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{option.label}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {option.description}
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="museumName"
            label={labels.nameLabel}
            rules={[
              {
                required: true,
                message: `Please enter your ${labels.nameLabel.toLowerCase()}`,
              },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input size="large" placeholder={labels.namePlaceholder} />
          </Form.Item>

          <Alert
            message="You can start using MCurio immediately"
            description="Add items, manage exhibitions, track conservation work, and more. All features are available from day one."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              {loading ? "Setting up..." : "Get Started"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
