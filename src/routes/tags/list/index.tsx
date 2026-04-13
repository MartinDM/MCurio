import {
  List,
  useTable,
  DeleteButton,
  EditButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Tag, Space } from "antd";
import type { BaseRecord } from "@refinedev/core";

interface TagRecord extends BaseRecord {
  id: string;
  name: string;
  color: string;
  description?: string;
  created_at: string;
}

export const TagsList = () => {
  const { tableProps } = useTable<TagRecord>({
    resource: "tags",
    sorters: {
      initial: [
        {
          field: "name",
          order: "asc",
        },
      ],
    },
  });

  return (
    <List headerButtons={() => [<CreateButton key="create" />]}>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="name"
          title="Tag Name"
          render={(name: string, record: TagRecord) => (
            <Space>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: record.color || "#1890ff",
                  display: "inline-block",
                }}
              />
              <Tag color={record.color}>{name}</Tag>
            </Space>
          )}
        />
        <Table.Column
          dataIndex="description"
          title="Description"
          render={(description: string) =>
            description || <span style={{ opacity: 0.5 }}>No description</span>
          }
        />
        <Table.Column
          dataIndex="created_at"
          title="Created"
          render={(date: string) => new Date(date).toLocaleDateString()}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: TagRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
