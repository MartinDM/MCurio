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
import { Form, Input, Select, Space, Table, Tag, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

type Property = {
  id: string;
  name: string;
  type: "text" | "place" | "number" | "boolean";
  required: boolean;
  sort_order?: number;
};

const PROPERTY_TYPE_OPTIONS = [
  { label: "Text", value: "text" },
  { label: "Place", value: "place" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
];

const PropertyFields = () => {
  return (
    <>
      <Form.Item
        label="Property name"
        name="name"
        rules={[{ required: true, message: "Property name is required" }]}
      >
        <Input placeholder="Example: Origin Place" />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: "Type is required" }]}
        initialValue="text"
      >
        <Select options={PROPERTY_TYPE_OPTIONS} placeholder="Select type" />
      </Form.Item>

      <Form.Item
        label={
          <span>
            Sort order{" "}
            <Tooltip title="Controls the display order when adding properties to items. Lower numbers appear first. Existing properties with the same or higher numbers will be shifted down.">
              <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
            </Tooltip>
          </span>
        }
        name="sort_order"
        initialValue={0}
      >
        <Input type="number" min={0} />
      </Form.Item>

      <Form.Item
        label="Required"
        name="required"
        initialValue={false}
        valuePropName="value"
        getValueProps={(value) => ({ value: !!value })}
        normalize={(value) => !!value}
      >
        <Select
          options={[
            { label: "Optional", value: false },
            { label: "Required", value: true },
          ]}
        />
      </Form.Item>
    </>
  );
};

export const PropertyListPage = () => {
  const { tableProps } = useTable<Property>({
    resource: "properties",
  });

  return (
    <List headerButtons={<CreateButton />}>
      <Table {...tableProps} rowKey="id">
        <Table.Column<Property> dataIndex="name" title="Property" />
        <Table.Column<Property>
          dataIndex="type"
          title="Type"
          render={(value: Property["type"]) => <Tag>{value}</Tag>}
        />
        <Table.Column<Property>
          dataIndex="required"
          title="Required"
          render={(value) => (value ? "Yes" : "No")}
        />
        <Table.Column<Property> dataIndex="sort_order" title="Sort order" />
        <Table.Column<Property>
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

export const PropertyCreatePage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "properties",
    redirect: "list",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <PropertyFields />
      </Form>
    </Create>
  );
};

export const PropertyEditPage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "properties",
    redirect: "list",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <PropertyFields />
      </Form>
    </Edit>
  );
};
