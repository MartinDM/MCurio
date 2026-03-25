import { useList } from "@refinedev/core";

import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, List, Skeleton as AntdSkeleton, Space, Tag } from "antd";
import dayjs from "dayjs";

import { Text } from "@/components";

type Props = { limit?: number };

type ConditionReport = {
  id: string;
  item_id: string;
  date?: string | null;
  status?: "excellent" | "stable" | "needs_attention" | null;
  notes?: string | null;
  created_at?: string | null;
};

export const DashboardLatestActivities = ({ limit = 5 }: Props) => {
  const { data, isLoading, isError, error } = useList<ConditionReport>({
    resource: "condition_reports",
    pagination: {
      pageSize: limit,
    },
    sorters: [
      {
        field: "date",
        order: "desc",
      },
    ],
  });

  if (isError) {
    console.error("Error fetching latest inspections", error);
    return null;
  }

  const statusColor: Record<string, string> = {
    excellent: "green",
    stable: "blue",
    needs_attention: "orange",
  };

  return (
    <Card
      headStyle={{ padding: "16px" }}
      bodyStyle={{
        padding: "0 1rem",
      }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <UnorderedListOutlined />
          <Text size="sm" style={{ marginLeft: ".5rem" }}>
            Latest inspections
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: limit }).map((_, index) => ({
            id: index,
          }))}
          renderItem={(_item, index) => {
            return (
              <List.Item key={index}>
                <List.Item.Meta
                  avatar={
                    <AntdSkeleton.Avatar
                      active
                      size={48}
                      shape="square"
                      style={{
                        borderRadius: "4px",
                      }}
                    />
                  }
                  title={
                    <AntdSkeleton.Button
                      active
                      style={{
                        height: "16px",
                      }}
                    />
                  }
                  description={
                    <AntdSkeleton.Button
                      active
                      style={{
                        width: "300px",
                        height: "16px",
                      }}
                    />
                  }
                />
              </List.Item>
            );
          }}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data?.data || []}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta
                  title={dayjs(item.date ?? item.created_at).format(
                    "MMM DD, YYYY",
                  )}
                  description={
                    <Space size={4}>
                      <Text strong>Item #{item.item_id}</Text>
                      <Tag
                        color={statusColor[item.status || "stable"] || "blue"}
                      >
                        {item.status || "stable"}
                      </Tag>
                      {item.notes ? <Text>{item.notes}</Text> : null}
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};
