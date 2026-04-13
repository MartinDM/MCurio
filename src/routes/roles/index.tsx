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
import { Form, Input, Space, Table } from "antd";

type Role = {
  id: string;
  name: string;
};

const RoleFields = () => {
  return (
    <Form.Item
      label="Role name"
      name="name"
      rules={[{ required: true, message: "Role name is required" }]}
    >
      <Input placeholder="Example: Curator" />
    </Form.Item>
  );
};

export const RoleListPage = () => {
  const { tableProps } = useTable<Role>({
    resource: "roles",
  });

  return (
    <List headerButtons={<CreateButton />}>
      <Table {...tableProps} rowKey="id">
        <Table.Column<Role> dataIndex="name" title="Role" />
        <Table.Column<Role>
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

export const RoleCreatePage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "roles",
    redirect: "list",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <RoleFields />
      </Form>
    </Create>
  );
};

export const RoleEditPage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "roles",
    redirect: "list",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <RoleFields />
      </Form>
    </Edit>
  );
};
