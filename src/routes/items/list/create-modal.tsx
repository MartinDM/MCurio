import { useModalForm } from "@refinedev/antd";
import { useGo } from "@refinedev/core";

import { Form, Input, Modal, Select } from "antd";

const ITEM_TYPE_OPTIONS = [
  { label: "Art Piece", value: "art_piece" },
  { label: "Object", value: "object" },
  { label: "Photograph", value: "photograph" },
  { label: "Document", value: "document" },
];

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

  const itemType = Form.useWatch("item_type", formProps.form) ?? "art_piece";

  return (
    <Modal
      {...modalProps}
      mask={true}
      onCancel={goToListPage}
      title="Add new item"
      width={512}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Item type"
          name="item_type"
          rules={[{ required: true }]}
          initialValue="art_piece"
        >
          <Select options={ITEM_TYPE_OPTIONS} placeholder="Select item type" />
        </Form.Item>
        <Form.Item label="Item title" name="title" rules={[{ required: true }]}>
          <Input placeholder="Please enter item title" />
        </Form.Item>
        <Form.Item label="Display name" name="name">
          <Input placeholder="Optional display name" />
        </Form.Item>
        {itemType === "art_piece" ? (
          <Form.Item label="Artist / Creator" name="artist">
            <Input placeholder="Artist / creator" />
          </Form.Item>
        ) : (
          <Form.Item
            label={
              itemType === "photograph" ? "Photographer" : "Maker / Origin"
            }
            name="maker_origin"
          >
            <Input placeholder="Maker / origin" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
