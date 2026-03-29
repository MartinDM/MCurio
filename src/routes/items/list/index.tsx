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

import { SearchOutlined } from "@ant-design/icons";
import { Input, Space, Table, Tag } from "antd";

import { CustomAvatar, PaginationTotal, Text } from "@/components";
type Item = {
  id: string;
  title: string;
  name?: string | null;
  item_type?: "art_piece" | "object" | "photograph" | "document";
  avatarUrl?: string | null;
};

export const ItemListPage = ({ children }: React.PropsWithChildren) => {
  const go = useGo();

  const { tableProps, filters } = useTable<Item, HttpError, Item>({
    resource: "items",
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
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
          field: "name",
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
          return (
            <CreateButton
              onClick={() => {
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
            defaultFilteredValue={getDefaultFilter("name", filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Item" />
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
            fixed="right"
            dataIndex="id"
            title="Actions"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />

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
