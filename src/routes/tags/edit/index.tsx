import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, ColorPicker } from "antd";

interface TagFormValues {
  name: string;
  color: string;
  description?: string;
}

export const TagsEdit = () => {
  const { formProps, saveButtonProps } = useForm<TagFormValues>({
    action: "edit",
    resource: "tags",
  });

  return (
    <Edit saveButtonProps={saveButtonProps} breadcrumb={false}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tag Name"
          name="name"
          rules={[
            { required: true, message: "Please enter tag name" },
            { max: 50, message: "Tag name must be less than 50 characters" },
          ]}
        >
          <Input placeholder="Enter tag name (e.g., Impressionist, Donated, Fragile)" />
        </Form.Item>

        <Form.Item
          label="Color"
          name="color"
          rules={[{ required: true, message: "Please select a color" }]}
        >
          <ColorPicker
            showText={(color) => color.toHexString()}
            presets={[
              {
                label: "Recommended",
                colors: [
                  "#1890ff", // Blue - default
                  "#52c41a", // Green - positive
                  "#fa8c16", // Orange - warning
                  "#f5222d", // Red - urgent
                  "#722ed1", // Purple - special
                  "#13c2c2", // Cyan - info
                  "#eb2f96", // Magenta - highlight
                  "#faad14", // Gold - premium
                ],
              },
            ]}
          />
        </Form.Item>

        <Form.Item label="Description (Optional)" name="description">
          <Input.TextArea
            rows={3}
            placeholder="Brief description of when to use this tag"
            maxLength={200}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
