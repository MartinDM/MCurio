import { Edit, useForm, useSelect } from "@refinedev/antd";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";

const ITEM_TYPE_OPTIONS = [
  { label: "Art Piece", value: "art_piece" },
  { label: "Object", value: "object" },
  { label: "Photograph", value: "photograph" },
  { label: "Document", value: "document" },
];

const CONTACT_ROLE_OPTIONS = [
  { label: "Artist", value: "artist" },
  { label: "Donor", value: "donor" },
  { label: "Lender", value: "lender" },
  { label: "Curator", value: "curator" },
];

const ACQUISITION_TYPE_OPTIONS = [
  { label: "Purchase", value: "purchase" },
  { label: "Gift", value: "gift" },
  { label: "Loan", value: "loan" },
];

export const ItemForm = () => {
  const { saveButtonProps, formProps, formLoading } = useForm({
    redirect: false,
  });

  const itemType = Form.useWatch("item_type", formProps.form) ?? "art_piece";

  const { selectProps: contactSelectProps } = useSelect({
    resource: "contacts",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: exhibitionSelectProps } = useSelect({
    resource: "exhibitions",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      breadcrumb={false}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Item type"
          name="item_type"
          initialValue="art_piece"
          rules={[{ required: true }]}
        >
          <Select options={ITEM_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="Item title" />
        </Form.Item>
        <Form.Item label="Name" name="name">
          <Input placeholder="Display name" />
        </Form.Item>

        {itemType === "art_piece" ? (
          <Form.Item label="Artist / Creator" name="artist">
            <Input placeholder="Artist / creator" />
          </Form.Item>
        ) : (
          <Form.Item
            label={
              itemType === "photograph"
                ? "Photographer"
                : itemType === "document"
                ? "Author / Origin"
                : "Maker / Origin"
            }
            name="maker_origin"
          >
            <Input placeholder="Maker / origin" />
          </Form.Item>
        )}

        <Form.Item
          label={itemType === "art_piece" ? "Medium" : "Material / Technique"}
          name="medium"
        >
          <Input placeholder="Medium / material" />
        </Form.Item>

        <Form.Item label="Year" name="year">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Date notes" name="date_notes">
          <Input placeholder="Example: circa 1850, early 20th century" />
        </Form.Item>

        <Form.Item
          label="Period / Provenance"
          name="period_provenance"
          hidden={itemType === "art_piece"}
        >
          <Input placeholder="Period / provenance" />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select mode="tags" placeholder="Add tags" />
        </Form.Item>

        <Form.Item label="Current location" name="current_location">
          <Input placeholder="Gallery, storage, on loan, etc." />
        </Form.Item>

        <Form.Item label="Label text" name="label_text">
          <Input.TextArea rows={3} placeholder="Visitor-facing label text" />
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

        <Form.Item label="Acquisition type" name="acquisition_type">
          <Select options={ACQUISITION_TYPE_OPTIONS} allowClear />
        </Form.Item>

        <Form.Item label="Acquisition source" name="acquisition_source">
          <Input placeholder="Donor, lender, seller" />
        </Form.Item>

        <Form.Item label="Acquisition value" name="acquisition_value">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Contact" name="contact_id">
          <Select
            allowClear
            showSearch
            placeholder="Select contact"
            {...contactSelectProps}
          />
        </Form.Item>
        <Form.Item label="Contact role" name="contact_role">
          <Select options={CONTACT_ROLE_OPTIONS} placeholder="Select role" />
        </Form.Item>

        <Form.Item label="Exhibition" name="exhibition_id">
          <Select
            allowClear
            showSearch
            placeholder="Select exhibition"
            {...exhibitionSelectProps}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
