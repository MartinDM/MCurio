import {
  Create,
  CreateButton,
  DeleteButton,
  Edit,
  EditButton,
  List,
  useForm,
  useSelect,
  useTable,
} from "@refinedev/antd";
import { Form, Input, Select, Space, Table } from "antd";

type Profile = {
  id: string;
  museum_id?: string | null;
  is_admin?: boolean;
  created_at?: string;
};

export const ProfileListPage = () => {
  const { tableProps } = useTable<Profile>({ resource: "profiles" });

  return (
    <List headerButtons={<CreateButton />}>
      <Table {...tableProps} rowKey="id">
        <Table.Column<Profile> dataIndex="id" title="User ID" />
        <Table.Column<Profile> dataIndex="museum_id" title="Museum ID" />
        <Table.Column<Profile>
          dataIndex="is_admin"
          title="Admin"
          render={(value) => (value ? "Yes" : "No")}
        />
        <Table.Column<Profile>
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

const ProfileFields = () => {
  const { selectProps: museumSelectProps } = useSelect({
    resource: "museums",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <>
      <Form.Item
        label="User ID"
        name="id"
        rules={[{ required: true, message: "User ID is required" }]}
      >
        <Input placeholder="Auth user id (uuid)" />
      </Form.Item>
      <Form.Item label="Museum" name="museum_id">
        <Select allowClear placeholder="Select museum" {...museumSelectProps} />
      </Form.Item>
      <Form.Item
        label="Role"
        name="is_admin"
        valuePropName="value"
        getValueProps={(value) => ({ value: !!value })}
        normalize={(value) => !!value}
      >
        <Select
          options={[
            { label: "Standard User", value: false },
            { label: "Admin", value: true },
          ]}
        />
      </Form.Item>
    </>
  );
};

export const ProfileCreatePage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "profiles",
    redirect: "list",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <ProfileFields />
      </Form>
    </Create>
  );
};

export const ProfileEditPage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "profiles",
    redirect: "list",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <ProfileFields />
      </Form>
    </Edit>
  );
};
