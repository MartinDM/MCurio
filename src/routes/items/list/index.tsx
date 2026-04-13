import React from "react";

import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { getDefaultFilter, type HttpError, useGo } from "@refinedev/core";

import {
  DownloadOutlined,
  SearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Tag,
  message,
  Typography,
  Tooltip,
} from "antd";
import MDEditor from "@uiw/react-md-editor";

import { CustomAvatar, PaginationTotal, Text } from "@/components";
import { useItemCount } from "@/hooks/useItemCount";
import { generateItemLabelPDF, exportItemsAsJSON } from "@/utilities";
type Item = {
  id: string;
  title: string;
  name?: string | null;
  item_type?: "art_piece" | "object" | "photograph" | "document";
  avatarUrl?: string | null;
  label_text?: string;
  artist_name?: string;
  date_created?: string;
  medium?: string;
  dimensions?: string;
  properties?: string[] | null;
  owner_id?: string;
  contact_id?: string;
  owner?: {
    id: string;
    display_name: string;
    role: string;
  };
  contact?: {
    id: string;
    name: string;
    organization?: string;
  };
};

export const ItemListPage = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { itemUsage, loading: itemCountLoading } = useItemCount();

  const handleExportPDF = async (item: Item) => {
    try {
      await generateItemLabelPDF(item);
      message.success("Label PDF exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export PDF. Please try again.");
    }
  };

  const { tableProps, filters } = useTable<Item, HttpError, Item>({
    resource: "items",
    meta: {
      select:
        "*, owner:owner_id(id, display_name, role), contact:contact_id(id, name, organization)",
    },
    onSearch: (values) => {
      return [
        {
          field: "title",
          operator: "contains",
          value: values.title,
        },
        {
          field: "name",
          operator: "contains",
          value: values.title,
        },
      ];
    },
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "title",
          operator: "contains",
          value: undefined,
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
  });

  return (
    <div className="page-container">
      <List
        breadcrumb={false}
        headerButtons={() => {
          const canCreateItems = itemUsage?.canCreateMore ?? true;
          const isAtLimit = itemUsage?.isAtLimit ?? false;
          const currentCount = itemUsage?.currentCount ?? 0;
          const maxItems = itemUsage?.maxItems ?? 20;
          const usageText = itemUsage?.usageText ?? "0 of 20 items used";

          const disabledReason = isAtLimit
            ? `Item limit reached (${currentCount}/${maxItems}). Upgrade to add more.`
            : null;

          const createButton = (
            <CreateButton
              disabled={!canCreateItems}
              onClick={() => {
                if (!canCreateItems) return;
                // modal opens from the url (/items/new)
                // keep query params while navigating to create route
                // we are using `go` function because we want to keep the query params
                go({
                  to: {
                    resource: "items",
                    action: "create",
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: "replace",
                });
              }}
            />
          );

          const exportButton = (
            <Button
              icon={<FileTextOutlined />}
              onClick={async () => {
                try {
                  await exportItemsAsJSON();
                  message.success("Collection exported successfully!");
                } catch (error: any) {
                  message.error(error.message || "Failed to export collection");
                }
              }}
            >
              Export JSON
            </Button>
          );

          return (
            <Space>
              {exportButton}
              <div>
                {disabledReason ? (
                  <Tooltip title={disabledReason}>{createButton}</Tooltip>
                ) : (
                  createButton
                )}
                {itemUsage && !itemCountLoading && (
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {usageText}
                  </Typography.Text>
                )}
              </div>
            </Space>
          );
        }}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            pageSizeOptions: ["12", "24", "48", "96"],
            showTotal: (total) => (
              <PaginationTotal total={total} entityName="items" />
            ),
          }}
          rowKey="id"
        >
          <Table.Column<Item>
            dataIndex="title"
            title="Item title"
            defaultFilteredValue={getDefaultFilter("title", filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search by title or name" />
              </FilterDropdown>
            )}
            render={(_, record) => {
              return (
                <Space>
                  <CustomAvatar
                    shape="square"
                    name={record.title}
                    src={record.avatarUrl}
                  />
                  <Text
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.title || record.name}
                  </Text>
                </Space>
              );
            }}
          />
          <Table.Column<Item>
            dataIndex="label_text"
            title="Label"
            width={300}
            render={(value) => {
              if (!value) return null;
              return (
                <div style={{ maxHeight: "100px", overflow: "hidden" }}>
                  <MDEditor.Markdown
                    source={value}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "12px",
                    }}
                  />
                </div>
              );
            }}
          />
          <Table.Column<Item>
            dataIndex="item_type"
            title="Type"
            render={(value?: Item["item_type"]) => {
              if (!value) {
                return <Tag>art_piece</Tag>;
              }

              return <Tag>{value}</Tag>;
            }}
          />
          <Table.Column<Item>
            dataIndex="owner"
            title="Owner"
            width={150}
            render={(owner) => {
              if (!owner) return <Text type="secondary">No owner</Text>;
              return (
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, height: "auto" }}
                  onClick={() =>
                    go({
                      to: `/profiles/view/${owner.id}`,
                      type: "push",
                    })
                  }
                >
                  <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: "12px" }}>
                      {owner.display_name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "10px" }}>
                      {owner.role || "User"}
                    </Text>
                  </Space>
                </Button>
              );
            }}
          />
          <Table.Column<Item>
            dataIndex="contact"
            title="Contact"
            width={150}
            render={(contact) => {
              if (!contact) return <Text type="secondary">No contact</Text>;
              return (
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, height: "auto" }}
                  onClick={() =>
                    go({
                      to: `/contacts/view/${contact.id}`,
                      type: "push",
                    })
                  }
                >
                  <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: "12px" }}>
                      {contact.name}
                    </Text>
                    {contact.organization && (
                      <Text type="secondary" style={{ fontSize: "10px" }}>
                        {contact.organization}
                      </Text>
                    )}
                  </Space>
                </Button>
              );
            }}
          />
          <Table.Column<Item>
            dataIndex="properties"
            title="Properties"
            width={200}
            render={(properties?: string[] | null) => {
              if (!properties || properties.length === 0) {
                return <Text>-</Text>;
              }

              return (
                <Space size="small" wrap>
                  {properties.map((property, index) => (
                    <Tag key={index} color="blue" style={{ fontSize: "11px" }}>
                      {property}
                    </Tag>
                  ))}
                </Space>
              );
            }}
          />
          <Table.Column<Item>
            fixed="right"
            dataIndex="id"
            title="Actions"
            render={(value, record) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={async () => {
                    try {
                      await generateItemLabelPDF(record);
                      message.success("Label PDF downloaded successfully");
                    } catch (error) {
                      message.error("Failed to generate PDF");
                    }
                  }}
                  title="Download Label PDF"
                />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </div>
  );
};
