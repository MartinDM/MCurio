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

type Employee = {
  id: number;
  name?: string | null;
  email?: string | null;
  created_at?: string | null;
};

export const EmployeeListPage = () => {
  const { tableProps } = useTable<Employee>({ resource: "employees" });

  return (
    <List headerButtons={<CreateButton />}>
      <Table {...tableProps} rowKey="id">
        <Table.Column<Employee> dataIndex="id" title="ID" />
        <Table.Column<Employee> dataIndex="name" title="Name" />
        <Table.Column<Employee> dataIndex="email" title="Email" />
        <Table.Column<Employee>
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

const EmployeeFields = () => (
  <>
    <Form.Item label="Name" name="name">
      <Input placeholder="Employee name" />
    </Form.Item>
    <Form.Item label="Email" name="email">
      <Input placeholder="Employee email" />
    </Form.Item>
  </>
);

export const EmployeeCreatePage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "employees",
    redirect: "list",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <EmployeeFields />
      </Form>
    </Create>
  );
};

export const EmployeeEditPage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "employees",
    redirect: "list",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <EmployeeFields />
      </Form>
    </Edit>
  );
};
