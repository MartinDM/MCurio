import { Edit, useForm } from "@refinedev/antd";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";

const CONTACT_ROLE_OPTIONS = [
  { label: "Artist", value: "artist" },
  { label: "Donor", value: "donor" },
  { label: "Lender", value: "lender" },
  { label: "Curator", value: "curator" },
];

export const ItemForm = () => {
  const { saveButtonProps, formProps, formLoading } = useForm({
    redirect: false,
  });

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      breadcrumb={false}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="Item title" />
        </Form.Item>
        <Form.Item label="Name" name="name">
          <Input placeholder="Display name" />
        </Form.Item>
        <Form.Item label="Artist" name="artist">
          <Input placeholder="Artist" />
        </Form.Item>
        <Form.Item label="Medium" name="medium">
          <Input placeholder="Medium" />
        </Form.Item>
        <Form.Item label="Year" name="year">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>
        <Form.Item
          label="Acquisition date"
          name="acquisition_date"
          getValueProps={(value: string | Dayjs | null | undefined) => ({
            value: value ? dayjs(value) : undefined,
          })}
          getValueFromEvent={(value: Dayjs | null) =>
            value ? value.format("YYYY-MM-DD") : null
          }
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Contact ID" name="contact_id">
          <Input placeholder="Linked contact id" />
        </Form.Item>
        <Form.Item label="Contact role" name="contact_role">
          <Select options={CONTACT_ROLE_OPTIONS} placeholder="Select role" />
        </Form.Item>
        <Form.Item label="Exhibition ID" name="exhibition_id">
          <Input placeholder="Linked exhibition id" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
