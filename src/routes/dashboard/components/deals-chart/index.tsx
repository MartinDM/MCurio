import { useList } from "@refinedev/core";

import { TagsOutlined } from "@ant-design/icons";
import { Card, List } from "antd";

import { Text } from "@/components";

type ItemRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  artist?: string | null;
  created_at?: string | null;
};

export const DashboardDealsChart = () => {
  const { data, isLoading } = useList<ItemRecord>({
    resource: "items",
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });

  const items = (data?.data ?? []).slice().sort((firstItem, secondItem) => {
    const firstCreatedAt = firstItem.created_at
      ? new Date(firstItem.created_at).getTime()
      : 0;
    const secondCreatedAt = secondItem.created_at
      ? new Date(secondItem.created_at).getTime()
      : 0;
    return secondCreatedAt - firstCreatedAt;
  });

  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "24px 24px 0px 24px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <TagsOutlined />
          <Text size="sm" style={{ marginLeft: ".5rem" }}>
            Recent Items
          </Text>
        </div>
      }
    >
      <List
        loading={isLoading}
        dataSource={items}
        locale={{ emptyText: "No items yet" }}
        renderItem={(item) => {
          const itemTitle = item.title || item.name || "Untitled item";
          const subtitleParts = [item.artist, item.created_at].filter(Boolean);

          return (
            <List.Item>
              <List.Item.Meta
                title={itemTitle}
                description={subtitleParts.join(" · ")}
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};
