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
import { Input, Space, Table } from "antd";

import { CustomAvatar, PaginationTotal, Text } from "@/components";
type Exhibition = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export const ExhibitionsListPage = ({ children }: React.PropsWithChildren) => {
  const go = useGo();

  const { tableProps, filters } = useTable<Exhibition, HttpError, Exhibition>({
    resource: "exhibitions",
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
                // modal is a opening from the url (/exhibitions/new)
                // to open modal we need to navigate to the create page (/exhibitions/new)
                // we are using `go` function because we want to keep the query params
                go({
                  to: {
                    resource: "exhibitions",
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
              <PaginationTotal total={total} entityName="exhibitions" />
            ),
          }}
          rowKey="id"
        >
          <Table.Column<Exhibition>
            dataIndex="name"
            title="Exhibition title"
            defaultFilteredValue={getDefaultFilter("id", filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Exhibition" />
              </FilterDropdown>
            )}
            render={(_, record) => {
              return (
                <Space>
                  <CustomAvatar
                    shape="square"
                    name={record.name}
                    src={record.avatarUrl}
                  />
                  <Text
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.name}
                  </Text>
                </Space>
              );
            }}
          />
          <Table.Column<Exhibition>
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
