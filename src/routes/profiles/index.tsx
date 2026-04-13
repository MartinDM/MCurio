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
  role?: string | null;
  created_at?: string;
};

export const ProfileListPage = () => {
  const { tableProps } = useTable<Profile>({ resource: "profiles" });
  const { selectProps: roleSelectProps } = useSelect({
    resource: "roles",
    optionLabel: "name",
    optionValue: "id",
  });

  const roleNameById = new Map(
    (roleSelectProps.options ?? []).map((option) => [
      String(option.value),
      String(option.label),
    ]),
  );

  return (
    <List headerButtons={<CreateButton />}>
      <Table {...tableProps} rowKey="id">
        <Table.Column<Profile> dataIndex="id" title="User ID" />
        <Table.Column<Profile> dataIndex="museum_id" title="Museum ID" />
        <Table.Column<Profile>
          dataIndex="role"
          title="Role"
          render={(value) => value || "Unassigned"}
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

  const roleSelectProps = {
    options: [
      { value: "admin", label: "Admin" },
      { value: "editor", label: "Editor" },
      { value: "viewer", label: "Viewer" },
    ],
  };

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
      <Form.Item label="Role" name="role">
        <Select allowClear placeholder="Select role" {...roleSelectProps} />
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

export * from "./view";
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

export * from "./view";
