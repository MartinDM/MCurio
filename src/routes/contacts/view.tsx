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
} from "antd";
import {
  ContactsOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface ContactProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type?: string;
  organization?: string;
  notes?: string;
  created_at: string;
}

interface AssociatedItem {
  id: string;
  title: string;
  name?: string;
  item_type?: string;
  created_at: string;
}

export const ContactDetailPage = () => {
  const { queryResult } = useShow<ContactProfile>({
    resource: "contacts",
  });

  const { data: contactData, isLoading: contactLoading } = queryResult;
  const contact = contactData?.data;

  const { queryResult: itemsQuery } = useShow({
    resource: "items",
    id: contact?.id,
    queryOptions: {
      enabled: !!contact?.id,
    },
    metaData: {
      select: "id, title, name, item_type, created_at",
      filters: [
        {
          field: "contact_id",
          operator: "eq",
          value: contact?.id,
        },
      ],
    },
  });

  const { data: itemsData, isLoading: itemsLoading } = itemsQuery;
  const associatedItems = itemsData?.data || [];

  const itemColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: AssociatedItem) => (
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

  const getContactTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "academic":
        return "blue";
      case "private":
        return "green";
      case "corporate":
        return "orange";
      case "other_museum":
        return "purple";
      case "staff_member":
        return "red";
      default:
        return "default";
    }
  };

  const getContactTypeLabel = (type: string) => {
    if (!type) return "Other";
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Show isLoading={contactLoading} breadcrumb={false}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Contact Header */}
        <Card>
          <Space size="large">
            <Avatar
              size={64}
              icon={<ContactsOutlined />}
              style={{
                backgroundColor: getContactTypeColor(contact?.type || ""),
              }}
            />
            <div>
              <Title level={2} style={{ margin: "0 0 8px 0" }}>
                {contact?.name || "Contact"}
              </Title>
              <Space size="middle" wrap>
                <Tag
                  color={getContactTypeColor(contact?.type || "")}
                  icon={<ContactsOutlined />}
                >
                  {getContactTypeLabel(contact?.type || "")}
                </Tag>
                {contact?.organization && (
                  <Space size="small">
                    <HomeOutlined />
                    <Text>{contact.organization}</Text>
                  </Space>
                )}
                {contact?.email && (
                  <Space size="small">
                    <MailOutlined />
                    <Text copyable>{contact.email}</Text>
                  </Space>
                )}
                {contact?.phone && (
                  <Space size="small">
                    <PhoneOutlined />
                    <Text copyable>{contact.phone}</Text>
                  </Space>
                )}
              </Space>
            </div>
          </Space>
        </Card>

        {/* Contact Details */}
        <Card title="Contact Information">
          <Descriptions column={2}>
            <Descriptions.Item label="Name">
              {contact?.name || "Not set"}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color={getContactTypeColor(contact?.type || "")}>
                {getContactTypeLabel(contact?.type || "")}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Organization">
              {contact?.organization || "Not specified"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {contact?.email ? (
                <Text copyable>{contact.email}</Text>
              ) : (
                "Not provided"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {contact?.phone ? (
                <Text copyable>{contact.phone}</Text>
              ) : (
                "Not provided"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Added">
              {contact?.created_at
                ? new Date(contact.created_at).toLocaleDateString()
                : "Unknown"}
            </Descriptions.Item>
            {contact?.notes && (
              <Descriptions.Item label="Notes" span={2}>
                <Text>{contact.notes}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Associated Items */}
        <Card
          title={
            <Space>
              <span>Associated Items</span>
              <Tag color="blue">
                {Array.isArray(associatedItems) ? associatedItems.length : 0}
              </Tag>
            </Space>
          }
        >
          <Table
            dataSource={Array.isArray(associatedItems) ? associatedItems : []}
            columns={itemColumns}
            rowKey="id"
            loading={itemsLoading}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: "No items are associated with this contact.",
            }}
          />
        </Card>
      </Space>
    </Show>
  );
};
