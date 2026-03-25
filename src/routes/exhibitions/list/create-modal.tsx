import { useModalForm } from "@refinedev/antd";
import { useGo } from "@refinedev/core";

import { DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";

export const ExhibitionsCreateModal = () => {
  const go = useGo();

  const goToListPage = () => {
    go({
      to: { resource: "exhibitions", action: "list" },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const { formProps, modalProps } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "exhibitions",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
  });

  return (
    <Modal
      {...modalProps}
      mask={true}
      onCancel={goToListPage}
      title="Add new exhibition"
      width={512}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Exhibition name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Please enter exhibition name" />
        </Form.Item>
        <Form.Item
          label="Start date"
          name="start_date"
          getValueProps={(value: string | Dayjs | null | undefined) => ({
            value: value ? dayjs(value) : undefined,
          })}
          getValueFromEvent={(value: Dayjs | null) =>
            value ? value.format("YYYY-MM-DD") : null
          }
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="End date"
          name="end_date"
          getValueProps={(value: string | Dayjs | null | undefined) => ({
            value: value ? dayjs(value) : undefined,
          })}
          getValueFromEvent={(value: Dayjs | null) =>
            value ? value.format("YYYY-MM-DD") : null
          }
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select
            options={[
              { label: "Planned", value: "planned" },
              { label: "Current", value: "current" },
              { label: "Past", value: "past" },
            ]}
            placeholder="Select status"
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
