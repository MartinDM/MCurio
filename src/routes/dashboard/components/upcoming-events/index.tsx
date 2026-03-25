import { useList } from "@refinedev/core";

import { CalendarOutlined } from "@ant-design/icons";
import { Badge, Card, List, Skeleton as AntdSkeleton } from "antd";
import dayjs from "dayjs";

import { Text } from "@/components";

type ExhibitionEvent = {
  id: string;
  name: string;
  status?: "planned" | "current" | "past" | null;
  start_date?: string | null;
  end_date?: string | null;
};

export const CalendarUpcomingEvents = () => {
  const { data, isLoading } = useList<ExhibitionEvent>({
    resource: "exhibitions",
    pagination: {
      pageSize: 5,
    },
    sorters: [
      {
        field: "start_date",
        order: "asc",
      },
    ],
    filters: [
      {
        field: "start_date",
        operator: "gte",
        value: dayjs().format("YYYY-MM-DD"),
      },
    ],
  });

  const statusColor: Record<string, string> = {
    planned: "blue",
    current: "green",
    past: "default",
  };

  return (
    <Card
      style={{
        height: "100%",
      }}
      headStyle={{ padding: "8px 16px" }}
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
          <CalendarOutlined />
          <Text size="sm" style={{ marginLeft: ".7rem" }}>
            Upcoming events
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => {
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color="transparent" />}
                  title={
                    <AntdSkeleton.Button
                      active
                      style={{
                        height: "14px",
                      }}
                    />
                  }
                  description={
                    <AntdSkeleton.Button
                      active
                      style={{
                        width: "300px",
                        marginTop: "8px",
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
            const renderDate = () => {
              const start = dayjs(item.start_date).format(
                "MMM DD, YYYY - HH:mm",
              );
              const end = dayjs(item.end_date).format("MMM DD, YYYY - HH:mm");

              return `${start} - ${end}`;
            };

            return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge color={statusColor[item.status || "planned"]} />
                  }
                  title={<Text size="xs">{`${renderDate()}`}</Text>}
                  description={
                    <Text ellipsis={{ tooltip: true }} strong>
                      {item.name}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}

      {!isLoading && data?.data.length === 0 && <NoEvent />}
    </Card>
  );
};

const NoEvent = () => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "220px",
    }}
  >
    No Upcoming Event
  </span>
);
