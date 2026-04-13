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
import { Form, Input, Select, Space, Table } from "antd";
import { useOnboarding } from "@/hooks/useOnboarding";

type Contact = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  type?: string | null;
  organization?: string | null;
  notes?: string | null;
};

const TYPE_OPTIONS = [
  { label: "Academic", value: "academic" },
  { label: "Private", value: "private" },
  { label: "Corporate", value: "corporate" },
  { label: "Other Museum", value: "other_museum" },
  { label: "Staff Member", value: "staff_member" },
];

export const ContactListPage = () => {
  const { tableProps } = useTable<Contact>({
    resource: "contacts",
  });

  return (
    <List headerButtons={<CreateButton />}>
      <Table {...tableProps} rowKey="id">
        <Table.Column<Contact> dataIndex="name" title="Name" />
        <Table.Column<Contact> dataIndex="email" title="Email" />
        <Table.Column<Contact> dataIndex="phone" title="Phone" />
        <Table.Column<Contact> dataIndex="type" title="Type" />
        <Table.Column<Contact> dataIndex="organization" title="Organization" />
        <Table.Column<Contact>
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

export const ContactCreatePage = () => {
  const { completeStep } = useOnboarding();

  const { formProps, saveButtonProps } = useForm({
    resource: "contacts",
    redirect: "list",
    onMutationSuccess: () => {
      // Complete onboarding step when first contact is created
      completeStep("add_first_contact");
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter contact name" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" placeholder="Enter email" />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item label="Type" name="type">
          <Select placeholder="Select type" options={TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item label="Organization" name="organization">
          <Input placeholder="Enter organization" />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea placeholder="Enter notes" rows={4} />
        </Form.Item>
      </Form>
    </Create>
  );
};

export * from "./view";
export const ContactEditPage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "contacts",
    redirect: "list",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter contact name" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" placeholder="Enter email" />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item label="Type" name="type">
          <Select placeholder="Select type" options={TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item label="Organization" name="organization">
          <Input placeholder="Enter organization" />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea placeholder="Enter notes" rows={4} />
        </Form.Item>
      </Form>
    </Edit>
  );
};

export * from "./view";
