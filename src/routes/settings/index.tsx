import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  message,
  Alert,
  Tag,
  Descriptions,
  Modal,
  Select,
} from "antd";
import {
  CrownOutlined,
  UserAddOutlined,
  RocketOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useGetIdentity, useCreate } from "@refinedev/core";
import { supabase } from "@/lib/supabase";
import { useOnboarding } from "@/hooks/useOnboarding";

const { Title, Text } = Typography;

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  is_admin: boolean;
  museum: {
    id: string;
    name: string;
    plan_type: string;
    max_users: number;
    features_enabled: Record<string, boolean>;
  };
}

interface Invitation {
  id: string;
  email: string;
  role_name: string;
  created_at: string;
  expires_at: string;
  invited_by: {
    display_name: string;
  };
}

const PLAN_FEATURES = {
  personal: {
    name: "Personal Collection",
    price: "Free",
    color: "blue",
    features: [
      "Up to 20 items",
      "1 user",
      "Basic exhibitions",
      "PDF exports",
      "Basic reporting",
    ],
  },
  museum: {
    name: "Museum Plan",
    price: "$29/month",
    color: "gold",
    features: [
      "Up to 50 items",
      "Up to 10 users",
      "Advanced exhibitions",
      "Loan management",
      "Advanced reporting",
      "Bulk operations",
      "Priority support",
    ],
  },
};

export const AccountSettingsPage: React.FC = () => {
  const { data: identity } = useGetIdentity<{ id: string }>();
  const { museum, trialStatus, loading } = useOnboarding();
  const { mutate: createInvitation, isLoading: invitationLoading } =
    useCreate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [inviteForm] = Form.useForm();

  React.useEffect(() => {
    if (identity?.id) {
      fetchProfile();
      fetchInvitations();
    }
  }, [identity]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id, display_name, email, is_admin,
          museum:museum_id(
            id, name, plan_type, max_users, features_enabled
          )
        `,
        )
        .eq("id", identity?.id)
        .single();

      if (error) throw error;
      // Since museum is returned as an array from the query, access the first element
      const profileWithMuseum = {
        ...data,
        museum: data.museum[0] || {},
      };
      setProfile(profileWithMuseum as UserProfile);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      message.error("Failed to load profile");
    }
  };

  const fetchInvitations = async () => {
    if (!profile?.is_admin) return;

    try {
      const { data, error } = await supabase
        .from("user_invitations")
        .select(
          `
          id, email, role_name, created_at, expires_at,
          invited_by:invited_by_user_id(display_name)
        `,
        )
        .eq("museum_id", profile.museum.id)
        .is("accepted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      // Transform the data to match the interface structure
      const transformedData = (data || []).map((invitation: any) => ({
        ...invitation,
        invited_by: invitation.invited_by[0] || {
          display_name: "Unknown User",
        },
      }));
      setInvitations(transformedData);
    } catch (error: any) {
      console.error("Error fetching invitations:", error);
    }
  };

  const handleInviteUser = async (values: { email: string; role: string }) => {
    try {
      const { data, error } = await supabase.rpc("send_user_invitation", {
        target_email: values.email,
        target_museum_id: profile?.museum.id,
        target_role: values.role,
      });

      if (error) throw error;

      message.success(`Invitation sent to ${values.email}`);
      setShowInviteModal(false);
      inviteForm.resetFields();
      fetchInvitations();
    } catch (error: any) {
      console.error("Invitation error:", error);
      message.error(error.message || "Failed to send invitation");
    }
  };

  const handleUpgradePlan = async (planType: string) => {
    try {
      const { data, error } = await supabase.rpc("upgrade_museum_plan", {
        target_plan_type: planType,
      });

      if (error) throw error;

      message.success(
        `Plan upgraded to ${
          PLAN_FEATURES[planType as keyof typeof PLAN_FEATURES].name
        }`,
      );
      setShowUpgradeModal(false);
      fetchProfile();
    } catch (error: any) {
      console.error("Upgrade error:", error);
      message.error(error.message || "Failed to upgrade plan");
    }
  };

  const revokeInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from("user_invitations")
        .delete()
        .eq("id", invitationId);

      if (error) throw error;

      message.success("Invitation revoked");
      fetchInvitations();
    } catch (error: any) {
      console.error("Revoke error:", error);
      message.error("Failed to revoke invitation");
    }
  };

  if (loading || !profile) {
    return <div>Loading...</div>;
  }

  const currentPlan =
    PLAN_FEATURES[profile.museum.plan_type as keyof typeof PLAN_FEATURES];
  const canUpgrade = profile.museum.plan_type === "personal";

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2}>Account Settings</Title>

      {/* Current Plan */}
      <Card title="Current Plan" style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Tag
              color={currentPlan.color}
              icon={<CrownOutlined />}
              style={{ fontSize: "14px" }}
            >
              {currentPlan.name}
            </Tag>
            <Text type="secondary" style={{ marginLeft: "16px" }}>
              {currentPlan.price}
            </Text>
            {trialStatus && (
              <Tag color="orange" style={{ marginLeft: "8px" }}>
                Trial: {trialStatus.daysRemaining} days left
              </Tag>
            )}
          </div>
          {canUpgrade && profile.is_admin && (
            <Button
              type="primary"
              icon={<RocketOutlined />}
              onClick={() => setShowUpgradeModal(true)}
            >
              Upgrade Plan
            </Button>
          )}
        </div>

        <Divider />

        <Descriptions column={2} size="small">
          <Descriptions.Item label="Museum">
            {profile.museum.name}
          </Descriptions.Item>
          <Descriptions.Item label="Your Role">
            {profile.is_admin ? "Administrator" : "Member"}
          </Descriptions.Item>
          <Descriptions.Item label="Item Limit">
            {trialStatus
              ? `${trialStatus.itemsUsed}/${trialStatus.itemLimit}`
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="User Limit">
            {profile.museum.max_users} users max
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: "16px" }}>
          <Text strong>Features included:</Text>
          <ul style={{ marginTop: "8px", marginBottom: 0 }}>
            {currentPlan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </Card>

      {/* User Management (Admin only) */}
      {profile.is_admin && (
        <Card
          title="User Management"
          extra={
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setShowInviteModal(true)}
            >
              Invite User
            </Button>
          }
          style={{ marginBottom: "24px" }}
        >
          {invitations.length > 0 ? (
            <div>
              <Text strong>Pending Invitations:</Text>
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div>
                    <Text strong>{invitation.email}</Text>
                    <Text type="secondary" style={{ marginLeft: "12px" }}>
                      {invitation.role_name} • Expires{" "}
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </Text>
                  </div>
                  <Button
                    size="small"
                    danger
                    onClick={() => revokeInvitation(invitation.id)}
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Alert
              message="No pending invitations"
              description="Invite team members to collaborate on your collection."
              type="info"
              showIcon
            />
          )}
        </Card>
      )}

      {/* Profile Information */}
      <Card title="Profile Information">
        <Form layout="vertical" initialValues={profile}>
          <Form.Item label="Display Name" name="display_name">
            <Input placeholder="Your display name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Update Profile</Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Invite User Modal */}
      <Modal
        title="Invite User"
        open={showInviteModal}
        onCancel={() => setShowInviteModal(false)}
        footer={null}
      >
        <Form form={inviteForm} layout="vertical" onFinish={handleInviteUser}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter email address" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="colleague@example.com" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            initialValue="member"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
              <Select.Option value="member">Member</Select.Option>
              <Select.Option value="curator">Curator</Select.Option>
              <Select.Option value="researcher">Researcher</Select.Option>
            </Select>
          </Form.Item>

          <Alert
            message="The user will receive an email invitation to join your museum collection."
            type="info"
            style={{ marginBottom: "16px" }}
          />

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={() => setShowInviteModal(false)}
              style={{ marginRight: "8px" }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={invitationLoading}
            >
              Send Invitation
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Upgrade Plan Modal */}
      <Modal
        title="Upgrade Plan"
        open={showUpgradeModal}
        onCancel={() => setShowUpgradeModal(false)}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: "center" }}>
          <CrownOutlined
            style={{ fontSize: "48px", color: "#faad14", marginBottom: "16px" }}
          />
          <Title level={3}>Upgrade to Museum Plan</Title>
          <Text type="secondary">
            Unlock advanced features for your growing collection
          </Text>
        </div>

        <div style={{ margin: "24px 0" }}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Tag
                color="gold"
                style={{ fontSize: "16px", padding: "4px 12px" }}
              >
                Museum Plan - $29/month
              </Tag>
            </div>
            <ul>
              {PLAN_FEATURES.museum.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: "4px" }}>
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Alert
          message="This is a demo upgrade. In production, this would integrate with your billing system."
          type="warning"
          style={{ marginBottom: "16px" }}
        />

        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={() => handleUpgradePlan("museum")}
            style={{ marginRight: "12px" }}
          >
            Upgrade Now
          </Button>
          <Button onClick={() => setShowUpgradeModal(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AccountSettingsPage;
