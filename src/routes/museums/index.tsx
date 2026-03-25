import { Create, Edit, List, useForm, useTable } from "@refinedev/antd";
import { Form, Input, Table } from "antd";

type Museum = {
  id: string;
  name: string;
  address?: string | null;
  description?: string | null;
};

export const MuseumListPage = () => {
  const { tableProps } = useTable<Museum>({
    resource: "museums",
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column<Museum> dataIndex="name" title="Museum name" />
        <Table.Column<Museum> dataIndex="address" title="Address" />
      </Table>
    </List>
  );
};

export const MuseumCreatePage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "museums",
    redirect: "list",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Museum name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter museum name" />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input placeholder="Enter address" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
      </Form>
    </Create>
  );
};

export const MuseumEditPage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "museums",
    redirect: "list",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Museum name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter museum name" />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input placeholder="Enter address" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
