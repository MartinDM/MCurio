import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Alert, Spin, Result } from "antd";
import { useNavigate, useSearchParams } from "react-router";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { supabase } from "@/lib/supabase";

const { Title, Text } = Typography;

interface InvitationDetails {
  email: string;
  museum_name: string;
  invited_by_display_name: string;
  role_name: string;
  expires_at: string;
}

export const InvitationAcceptPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  const invitationToken = searchParams.get("token");

  useEffect(() => {
    if (invitationToken) {
      fetchInvitationDetails();
    } else {
      setError("No invitation token provided");
    }
  }, [invitationToken]);

  const fetchInvitationDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get invitation details (this requires a public function since user might not be authenticated)
      const { data, error } = await supabase
        .from("user_invitations")
        .select(
          `
          email,
          role_name,
          expires_at,
          museum:museum_id(name),
          invited_by:invited_by_user_id(display_name)
        `,
        )
        .eq("invitation_token", invitationToken)
        .is("accepted_at", null)
        .single();

      if (error) throw error;

      if (!data) {
        setError("Invitation not found or already accepted");
        return;
      }

      // Check if invitation has expired
      if (new Date(data.expires_at) < new Date()) {
        setError("This invitation has expired");
        return;
      }

      setInvitation({
        email: data.email,
        museum_name: data.museum?.[0]?.name || "Unknown Museum",
        invited_by_display_name:
          data.invited_by?.[0]?.display_name || "Unknown User",
        role_name: data.role_name,
        expires_at: data.expires_at,
      });
    } catch (error: any) {
      console.error("Error fetching invitation:", error);
      setError(error.message || "Failed to load invitation details");
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    setAccepting(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc("accept_invitation", {
        invitation_token: invitationToken,
      });

      if (error) throw error;

      setAccepted(true);

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      setError(error.message || "Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  const handleLoginRedirect = () => {
    // Store invitation token in session storage for after login
    if (invitationToken) {
      sessionStorage.setItem("invitation_token", invitationToken);
    }
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (accepted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <Result
          status="success"
          title="Invitation Accepted!"
          subTitle="Welcome to the team. You'll be redirected to your dashboard shortly."
          icon={<CheckCircleOutlined />}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <Result
          status="error"
          title="Invalid Invitation"
          subTitle={error}
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              Return Home
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "24px",
      }}
    >
      <Card style={{ maxWidth: "500px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <ExclamationCircleOutlined
            style={{ fontSize: "48px", color: "#1890ff", marginBottom: "16px" }}
          />
          <Title level={2}>You're Invited!</Title>
          <Text type="secondary">
            You've been invited to join a museum collection on MCurio
          </Text>
        </div>

        {invitation && (
          <>
            <Alert
              message="Invitation Details"
              description={
                <div style={{ marginTop: "8px" }}>
                  <div>
                    <strong>Museum:</strong> {invitation.museum_name}
                  </div>
                  <div>
                    <strong>Role:</strong> {invitation.role_name}
                  </div>
                  <div>
                    <strong>Invited by:</strong>{" "}
                    {invitation.invited_by_display_name}
                  </div>
                  <div>
                    <strong>Expires:</strong>{" "}
                    {new Date(invitation.expires_at).toLocaleDateString()}
                  </div>
                </div>
              }
              type="info"
              style={{ marginBottom: "24px" }}
            />

            <div style={{ textAlign: "center" }}>
              <Button
                type="primary"
                size="large"
                onClick={acceptInvitation}
                loading={accepting}
                style={{ marginRight: "12px" }}
              >
                Accept Invitation
              </Button>
              <Button
                onClick={handleLoginRedirect}
                style={{ marginBottom: "16px" }}
              >
                Sign In First
              </Button>

              <div style={{ marginTop: "16px" }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  By accepting this invitation, you'll have access to
                  collaborative museum collection management tools.
                </Text>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default InvitationAcceptPage;
