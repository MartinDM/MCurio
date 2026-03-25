import { useModalForm } from "@refinedev/antd";
import { useGo } from "@refinedev/core";

import { Form, Input, Modal } from "antd";

export const ItemCreateModal = () => {
  const go = useGo();

  const goToListPage = () => {
    go({
      to: { resource: "items", action: "list" },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const { formProps, modalProps } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "items",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
  });

  return (
    <Modal
      {...modalProps}
      mask={true}
      onCancel={goToListPage}
      title="Add new item"
      width={512}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label="Item title" name="title" rules={[{ required: true }]}>
          <Input placeholder="Please enter item title" />
        </Form.Item>
        <Form.Item label="Display name" name="name">
          <Input placeholder="Optional display name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
