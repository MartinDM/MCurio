import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const ExhibitionForm = () => {
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
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Exhibition name" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
