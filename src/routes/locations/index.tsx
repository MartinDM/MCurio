import {
  Create,
  CreateButton,
  DeleteButton,
  Edit,
  EditButton,
  List,
  useForm,
  useTable,
} from "@refinedev/antd";
import { Form, Input, Select, Space, Table, Tag } from "antd";

const LOCATION_TYPE_OPTIONS = [
  { label: "Storage", value: "storage" },
  { label: "Gallery", value: "gallery" },
  { label: "Conservation Lab", value: "conservation_lab" },
  { label: "External", value: "external" },
  { label: "On Loan", value: "on_loan" },
  { label: "In Transit", value: "transit" },
];

type Location = {
  id: string;
  name: string;
  location_type: string;
  description?: string | null;
  museum_id: string;
};

export const LocationListPage = () => {
  const { tableProps } = useTable<Location>({
    resource: "locations",
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
    <List headerButtons={<CreateButton />}>
      <Table {...tableProps} rowKey="id">
        <Table.Column<Location> dataIndex="name" title="Location Name" />
        <Table.Column<Location>
          dataIndex="location_type"
          title="Type"
          render={(type) => (
            <Tag
              color={
                type === "gallery"
                  ? "blue"
                  : type === "storage"
                  ? "green"
                  : "default"
              }
            >
              {LOCATION_TYPE_OPTIONS.find((opt) => opt.value === type)?.label ||
                type}
            </Tag>
          )}
        />
        <Table.Column<Location>
          dataIndex="description"
          title="Description"
          render={(text) => text || "-"}
        />
        <Table.Column<Location>
          title="Actions"
          render={(_, record) => (
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

export const LocationCreatePage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "locations",
    redirect: "list",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Location Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter location name (e.g., Main Storage, Gallery A)" />
        </Form.Item>
        <Form.Item
          label="Location Type"
          name="location_type"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select location type"
            options={LOCATION_TYPE_OPTIONS}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            placeholder="Enter location description (optional)"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};

export const LocationEditPage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "locations",
    redirect: "list",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Location Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter location name (e.g., Main Storage, Gallery A)" />
        </Form.Item>
        <Form.Item
          label="Location Type"
          name="location_type"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select location type"
            options={LOCATION_TYPE_OPTIONS}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            placeholder="Enter location description (optional)"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
