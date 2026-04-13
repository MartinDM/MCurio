import React from "react";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Avatar,
  Space,
  Typography,
  Divider,
  Progress,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  TeamOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import { useStorageUsage } from "@/hooks/useStorageUsage";

const { Title, Text } = Typography;

interface StaffProfile {
  id: string;
  display_name: string;
  role: string;
  created_at: string;
  auth_users?: {
    email: string;
  };
  museums?: {
    name: string;
  };
}

interface OwnedItem {
  id: string;
  title: string;
  name?: string;
  item_type?: string;
  created_at: string;
}

export const ProfileDetailPage = () => {
  const { queryResult } = useShow<StaffProfile>({
    resource: "profiles",
    metaData: {
      select: `
        *,
        auth_users:auth.users(email),
        museums(name)
      `,
    },
  });

  const { data: profileData, isLoading: profileLoading } = queryResult;
  const profile = profileData?.data;

  // Storage usage hook
  const { storageUsage, loading: storageLoading } = useStorageUsage();

  const { queryResult: itemsQuery } = useShow({
    resource: "items",
    id: profile?.id,
    queryOptions: {
      enabled: !!profile?.id,
    },
    metaData: {
      select: "id, title, name, item_type, created_at",
      filters: [
        {
          field: "owner_id",
          operator: "eq",
          value: profile?.id,
        },
      ],
    },
  });

  const { data: itemsData, isLoading: itemsLoading } = itemsQuery;
  const ownedItems = itemsData?.data || [];

  const itemColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: OwnedItem) => (
        <a href={`/items/show/${record.id}`}>
          {title}
          {record.name && (
            <Text
              type="secondary"
              style={{ display: "block", fontSize: "12px" }}
            >
              {record.name}
            </Text>
          )}
        </a>
      ),
    },
    {
      title: "Type",
      dataIndex: "item_type",
      key: "item_type",
      render: (type: string) =>
        type ? (
          <Tag color="blue">
            {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Tag>
        ) : null,
    },
    {
      title: "Added",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "red";
      case "editor":
        return "blue";
      case "viewer":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <Show isLoading={profileLoading} breadcrumb={false}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Profile Header */}
        <Card>
          <Space size="large">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <div>
              <Title level={2} style={{ margin: "0 0 8px 0" }}>
                {profile?.display_name || "Staff Member"}
              </Title>
              <Space size="middle">
                <Tag
                  color={getRoleColor(profile?.role || "")}
                  icon={<TeamOutlined />}
                >
                  {profile?.role?.toUpperCase()}
                </Tag>
                {profile?.auth_users?.email && (
                  <Space size="small">
                    <MailOutlined />
                    <Text copyable>{profile.auth_users.email}</Text>
                  </Space>
                )}
              </Space>
            </div>
          </Space>
        </Card>

        {/* Profile Details */}
        <Card title="Staff Details">
          <Descriptions column={2}>
            <Descriptions.Item label="Display Name">
              {profile?.display_name || "Not set"}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={getRoleColor(profile?.role || "")}>
                {profile?.role?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {profile?.auth_users?.email || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Museum">
              {profile?.museums?.name || "Not assigned"}
            </Descriptions.Item>
            <Descriptions.Item label="Member Since">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "Unknown"}
            </Descriptions.Item>
          </Descriptions>

          {/* Storage Usage */}
          <Divider />
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space align="center">
              <CloudOutlined />
              <Text strong>Storage Usage</Text>
            </Space>
            {storageLoading ? (
              <Progress percent={0} showInfo={false} />
            ) : storageUsage ? (
              <div>
                <Progress
                  percent={Number(storageUsage.usagePercentage.toFixed(1))}
                  status={
                    storageUsage.isAtLimit
                      ? "exception"
                      : storageUsage.isNearLimit
                      ? "active"
                      : "normal"
                  }
                  strokeColor={
                    storageUsage.isAtLimit
                      ? "#ff4d4f"
                      : storageUsage.isNearLimit
                      ? "#faad14"
                      : "#52c41a"
                  }
                />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {storageUsage.formattedUsed} of {storageUsage.formattedLimit}{" "}
                  used
                  {storageUsage.isAtLimit && (
                    <Text type="danger" style={{ marginLeft: 8 }}>
                      Storage limit reached
                    </Text>
                  )}
                  {storageUsage.isNearLimit && !storageUsage.isAtLimit && (
                    <Text type="warning" style={{ marginLeft: 8 }}>
                      Approaching storage limit
                    </Text>
                  )}
                </Text>
              </div>
            ) : (
              <Text type="secondary">Unable to load storage usage</Text>
            )}
          </Space>
        </Card>

        {/* Owned Items */}
        <Card
          title={
            <Space>
              <span>Items Owned</span>
              <Tag color="blue">
                {Array.isArray(ownedItems) ? ownedItems.length : 0}
              </Tag>
            </Space>
          }
        >
          <Table
            dataSource={Array.isArray(ownedItems) ? ownedItems : []}
            columns={itemColumns}
            rowKey="id"
            loading={itemsLoading}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: "This staff member doesn't own any items yet.",
            }}
          />
        </Card>
      </Space>
    </Show>
  );
};
