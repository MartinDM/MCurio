import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useCreate, useParsed, useGetIdentity } from "@refinedev/core";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  Tag,
  message,
  Space,
  Table,
  Typography,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dayjs, { Dayjs } from "dayjs";
import React, { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { useOnboarding } from "@/hooks/useOnboarding";
import { generateItemLabelPDF } from "@/utilities";

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

const LOCATION_TYPE_OPTIONS = [
  { label: "Storage", value: "storage" },
  { label: "Gallery", value: "gallery" },
  { label: "Conservation Lab", value: "conservation_lab" },
  { label: "External", value: "external" },
  { label: "On Loan", value: "on_loan" },
  { label: "In Transit", value: "transit" },
];

const LOAN_TYPE_OPTIONS = [
  { label: "Incoming (Borrowed from)", value: "incoming" },
  { label: "Outgoing (Lent to)", value: "outgoing" },
];

const LOAN_STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Extended", value: "extended" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
  { label: "Cancelled", value: "cancelled" },
];

const ACQUISITION_TYPE_OPTIONS = [
  { label: "Purchase", value: "purchase" },
  { label: "Gift", value: "gift" },
  { label: "Loan", value: "loan" },
];

// Contact creation modal component
const ContactCreateModal = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (contactId: string) => void;
}) => {
  const [form] = Form.useForm();
  const { mutate: createContact, isLoading } = useCreate();

  const handleSubmit = async (values: any) => {
    createContact(
      {
        resource: "contacts",
        values,
      },
      {
        onSuccess: (data) => {
          message.success("Contact created successfully");
          onSuccess(String(data.data?.id || data.data));
          form.resetFields();
          onClose();
        },
        onError: (error) => {
          console.error("Contact creation error:", error);
          message.error("Failed to create contact");
        },
      },
    );
  };

  return (
    <Modal
      title="Create New Contact"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="Contact Name"
          name="name"
          rules={[{ required: true, message: "Please enter contact name" }]}
        >
          <Input placeholder="e.g., John Smith" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Please enter valid email" }]}
        >
          <Input placeholder="contact@email.com" />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input placeholder="+44 123 456 7890" />
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Select
            placeholder="Select contact type"
            options={[
              { label: "Academic", value: "academic" },
              { label: "Private", value: "private" },
              { label: "Corporate", value: "corporate" },
              { label: "Other Museum", value: "other_museum" },
              { label: "Staff Member", value: "staff_member" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Organization" name="organization">
          <Input placeholder="Organization name" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Contact
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Loan creation modal component
const LoanCreateModal = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (loanId: string) => void;
}) => {
  const [form] = Form.useForm();
  const { mutate: createLoan, isLoading } = useCreate();

  const { selectProps: contactSelectProps } = useSelect({
    resource: "contacts",
    optionLabel: "name",
    optionValue: "id",
  });

  const handleSubmit = async (values: any) => {
    // Convert date fields to proper format
    const formattedValues = {
      ...values,
      agreement_date: values.agreement_date?.format("YYYY-MM-DD"),
      start_date: values.start_date?.format("YYYY-MM-DD"),
      end_date: values.end_date?.format("YYYY-MM-DD"),
      agreed_return_date: values.agreed_return_date?.format("YYYY-MM-DD"),
    };

    createLoan(
      {
        resource: "loan_agreements",
        values: formattedValues,
      },
      {
        onSuccess: (data) => {
          message.success("Loan created successfully");
          onSuccess(String(data.data?.id || data.data));
          form.resetFields();
          onClose();
        },
        onError: (error) => {
          console.error("Loan creation error:", error);
          message.error("Failed to create loan");
        },
      },
    );
  };

  return (
    <Modal
      title="Create New Loan"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="Loan Number/Reference"
          name="loan_number"
          rules={[{ required: true, message: "Please enter loan number" }]}
        >
          <Input placeholder="e.g., LOAN-2026-001" />
        </Form.Item>

        <Form.Item
          label="Loan Type"
          name="loan_type"
          rules={[{ required: true, message: "Please select loan type" }]}
        >
          <Select options={LOAN_TYPE_OPTIONS} placeholder="Select loan type" />
        </Form.Item>

        <Form.Item label="Description/Purpose" name="description">
          <Input.TextArea
            rows={3}
            placeholder="Purpose or description of the loan"
          />
        </Form.Item>

        <Form.Item label="Lender Contact" name="lender_contact_id">
          <Select
            showSearch
            placeholder="Select lender contact"
            {...contactSelectProps}
          />
        </Form.Item>

        <Form.Item label="Borrower Contact" name="borrower_contact_id">
          <Select
            showSearch
            placeholder="Select borrower contact"
            {...contactSelectProps}
          />
        </Form.Item>

        <Form.Item
          label="Internal Approver"
          name="internal_approver_contact_id"
        >
          <Select
            showSearch
            placeholder="Select internal approver"
            {...contactSelectProps}
          />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="start_date"
          rules={[{ required: true, message: "Please select start date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="end_date"
          rules={[{ required: true, message: "Please select end date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Agreed Return Date (Optional)"
          name="agreed_return_date"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          initialValue="draft"
          rules={[{ required: true }]}
        >
          <Select options={LOAN_STATUS_OPTIONS} />
        </Form.Item>

        <Form.Item label="Insurance Value" name="insurance_value">
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Insurance value"
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item label="Attachment" name="attachment_url">
          <Upload
            maxCount={1}
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                // In a real app, you'd upload the file and get URL
                // For now, just set a placeholder
                form.setFieldValue("attachment_url", info.fileList[0].name);
              }
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Agreement</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Loan
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Location creation modal component
const LocationCreateModal = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (locationId: string) => void;
}) => {
  const [form] = Form.useForm();
  const { mutate: createLocation, isLoading } = useCreate();

  const handleSubmit = async (values: any) => {
    createLocation(
      {
        resource: "locations",
        values,
      },
      {
        onSuccess: (data) => {
          message.success("Location created successfully");
          onSuccess(String(data.data?.id || data.data));
          form.resetFields();
          onClose();
        },
        onError: (error) => {
          console.error("Location creation error:", error);
          message.error("Failed to create location");
        },
      },
    );
  };

  return (
    <Modal
      title="Create New Location"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="Location Name"
          name="name"
          rules={[{ required: true, message: "Please enter location name" }]}
        >
          <Input placeholder="e.g., Gallery A, Storage Room 1" />
        </Form.Item>

        <Form.Item
          label="Location Type"
          name="location_type"
          rules={[{ required: true, message: "Please select location type" }]}
        >
          <Select
            placeholder="Select location type"
            options={LOCATION_TYPE_OPTIONS}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Optional description" rows={3} />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Location
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const ItemForm = () => {
  const { id } = useParsed();
  const { data: identity } = useGetIdentity<{ id: string }>();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showExhibitionItemModal, setShowExhibitionItemModal] = useState(false);
  const [movementHistory, setMovementHistory] = useState<any[]>([]);
  const [exhibitionItems, setExhibitionItems] = useState<any[]>([]);

  // State for museum staff
  const [museumStaff, setMuseumStaff] = useState<
    Array<{ id: string; display_name: string; role?: string }>
  >([]);
  const [staffLoading, setStaffLoading] = useState(true);

  const { saveButtonProps, formProps, formLoading } = useForm({
    redirect: false,
    onMutationSuccess: (data) => {
      // Set default owner to current user for new items
      if (!id && !formProps.form?.getFieldValue("owner_id")) {
        // This will be handled by the database default, but we can set it here for UI consistency
        const currentUser = supabase.auth.getUser();
        currentUser.then((user) => {
          if (user.data.user) {
            formProps.form?.setFieldValue("owner_id", user.data.user.id);
          }
        });
      }
    },
  });

  const itemType = Form.useWatch("item_type", formProps.form) ?? "art_piece";

  const { selectProps: contactSelectProps, query: contactQuery } = useSelect({
    resource: "contacts",
    optionLabel: "name",
    optionValue: "id",
  });

  // Get museum staff for owner dropdown
  useEffect(() => {
    const fetchMuseumStaff = async () => {
      try {
        setStaffLoading(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("museum_id")
          .eq("id", identity?.id)
          .single();

        if (profile?.museum_id) {
          const { data: staff } = await supabase
            .from("profiles")
            .select("id, display_name, role")
            .eq("museum_id", profile.museum_id)
            .order("display_name");

          setMuseumStaff(staff || []);
        }
      } catch (error) {
        console.error("Error fetching museum staff:", error);
      } finally {
        setStaffLoading(false);
      }
    };

    if (identity?.id) {
      fetchMuseumStaff();
    }
  }, [identity?.id]);

  // Set default owner to current user for new items
  useEffect(() => {
    if (
      !id &&
      !formProps.form?.getFieldValue("owner_id") &&
      identity?.id &&
      museumStaff.length > 0
    ) {
      const currentUserInStaff = museumStaff.find(
        (staff) => staff.id === identity.id,
      );
      if (currentUserInStaff) {
        formProps.form?.setFieldValue("owner_id", identity.id);
      } else if (museumStaff.length > 0) {
        // If current user isn't in staff list, default to first staff member
        formProps.form?.setFieldValue("owner_id", museumStaff[0].id);
      }
    }
  }, [id, identity?.id, museumStaff, formProps.form]);

  const { selectProps: exhibitionSelectProps } = useSelect({
    resource: "exhibitions",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: locationSelectProps, query: locationQuery } = useSelect({
    resource: "locations",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: loanSelectProps, query: loanQuery } = useSelect({
    resource: "loan_agreements",
    optionLabel: "loan_number",
    optionValue: "id",
    meta: {
      select:
        "*, lender_contact:contacts!lender_contact_id(name), borrower_contact:contacts!borrower_contact_id(name)",
    },
  });

  // Handle new location creation
  const handleLocationCreated = (locationId: string) => {
    // Refresh locations query
    locationQuery.refetch();
    // Set the new location in the form
    formProps.form?.setFieldValue("current_location_id", locationId);
  };

  // Handle new loan creation
  const handleLoanCreated = (loanId: string) => {
    // Refresh loans query
    loanQuery.refetch();
    // Set the new loan in the form
    formProps.form?.setFieldValue("current_loan_agreement_id", loanId);
  };

  // Handle successful contact creation
  const handleContactSuccess = (contactId: string) => {
    contactQuery.refetch();
    formProps.form?.setFieldValue("external_contact_id", contactId);
  };

  // Fetch movement history
  const fetchMovementHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("item_movements")
        .select(
          `
          id, movement_date, reason, notes,
          from_location:from_location_id(name),
          to_location:to_location_id(name),
          moved_by:moved_by_contact_id(name)
        `,
        )
        .eq("item_id", id)
        .order("movement_date", { ascending: false });

      if (error) throw error;
      setMovementHistory(data || []);
    } catch (error) {
      console.error("Error fetching movement history:", error);
    }
  };

  // Fetch exhibition items
  const fetchExhibitionItems = async () => {
    try {
      const { data, error } = await supabase
        .from("exhibition_items")
        .select(
          `
          id, display_order, display_location, item_role, label_text,
          date_installed, date_removed, installation_notes,
          exhibition:exhibition_id(name)
        `,
        )
        .eq("item_id", id)
        .order("date_installed", { ascending: false });

      if (error) throw error;
      setExhibitionItems(data || []);
    } catch (error) {
      console.error("Error fetching exhibition items:", error);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (id) {
      fetchMovementHistory();
      fetchExhibitionItems();
    }
  }, [id]);

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

        <Form.Item
          label="Owner"
          name="owner_id"
          rules={[{ required: true, message: "Please select an owner" }]}
          tooltip="The staff member responsible for this item"
        >
          <Select
            placeholder="Select owner"
            loading={staffLoading}
            options={museumStaff.map((staff) => ({
              label: staff.display_name || "Unnamed User",
              value: staff.id,
              data: staff,
            }))}
            optionRender={(option) => (
              <div>
                <div>{(option.data as any)?.display_name || "Unnamed User"}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {(option.data as any)?.role || "Staff Member"}
                </div>
              </div>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Associated Contact"
          name="contact_id"
          tooltip="External contact related to this item (donor, lender, etc.)"
        >
          <Select
            placeholder="Select contact (optional)"
            allowClear
            {...contactSelectProps}
            optionRender={(option) => (
              <div>
                <div>{option.data?.name}</div>
                {option.data?.organization && (
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {option.data.organization}
                  </div>
                )}
              </div>
            )}
          />
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

        <Form.Item label="Tags" name="tag_ids">
          <Select
            mode="multiple"
            placeholder="Add tags"
            {...useSelect({
              resource: "tags",
              optionLabel: "name",
              optionValue: "id",
            }).selectProps}
            optionRender={(option) => (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: option.data?.color || "#1890ff",
                  }}
                />
                {option.label}
              </div>
            )}
          />
        </Form.Item>

        <Form.Item label="Current location" name="current_location_id">
          <Select
            allowClear
            showSearch
            placeholder="Select a location"
            {...locationSelectProps}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div style={{ padding: 8, borderTop: "1px solid #f0f0f0" }}>
                  <Button
                    type="link"
                    onClick={() => setShowLocationModal(true)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "4px 0",
                      height: "auto",
                    }}
                  >
                    + Create New Location
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>

        <Form.Item label="Current Loan" name="current_loan_agreement_id">
          <Select
            allowClear
            showSearch
            placeholder="Select or create a loan"
            {...loanSelectProps}
            optionRender={(option) => (
              <div>
                <div style={{ fontWeight: "bold" }}>
                  {option.data?.loan_number}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {option.data?.loan_type} • {option.data?.status}
                  {option.data?.lender_contact?.name &&
                    ` • ${option.data.lender_contact.name}`}
                </div>
              </div>
            )}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div style={{ padding: 8, borderTop: "1px solid #f0f0f0" }}>
                  <Button
                    type="link"
                    onClick={() => setShowLoanModal(true)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "4px 0",
                      height: "auto",
                    }}
                  >
                    + Create New Loan
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>

        <Form.Item label="Label text" name="label_text">
          <MDEditor
            data-color-mode="light"
            preview="edit"
            hideToolbar
            visibleDragbar={false}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>

        <Form.Item label="Item story" name="story_content">
          <Input.TextArea
            rows={6}
            placeholder="Accompanying story content for this item"
          />
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
          <Input
            placeholder="Donor, lender, seller (Note: Will be converted to contact relationship)"
            addonAfter={
              <span style={{ fontSize: "12px", opacity: 0.7 }}>
                ⚠️ Legacy field
              </span>
            }
          />
        </Form.Item>

        <Form.Item label="Acquisition value" name="acquisition_value">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Owner (Internal)"
          name="owner_id"
          rules={[{ required: true, message: "Please select an owner" }]}
        >
          <Select
            showSearch
            placeholder="Select internal owner/staff member"
            loading={staffLoading}
            options={museumStaff.map((staff) => ({
              label: staff.display_name || "Unnamed User",
              value: staff.id,
              data: staff,
            }))}
            optionRender={(option) => (
              <div>
                <div style={{ fontWeight: "bold" }}>
                  {(option.data as any)?.display_name || "Unnamed User"}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {(option.data as any)?.role || "Staff Member"}
                </div>
              </div>
            )}
          />
        </Form.Item>

        <Form.Item
          label="External Contact (Optional)"
          name="external_contact_id"
        >
          <Select
            allowClear
            showSearch
            placeholder="Select external contact (donor, lender, etc.)"
            {...contactSelectProps}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div style={{ padding: 8, borderTop: "1px solid #f0f0f0" }}>
                  <Button
                    type="link"
                    onClick={() => setShowContactModal(true)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "4px 0",
                      height: "auto",
                    }}
                  >
                    + Create New Contact
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>

        <Form.Item label="Exhibition" name="exhibition_id">
          <Select
            allowClear
            showSearch
            placeholder="Select exhibition"
            {...exhibitionSelectProps}
          />
        </Form.Item>

        {/* Movement Tracking Section */}
        <Form.Item label="Movement Tracking">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setShowMovementModal(true)}
              style={{ width: "100%" }}
            >
              Record Item Movement
            </Button>
            <Button
              icon={<HistoryOutlined />}
              onClick={() => fetchMovementHistory()}
              style={{ width: "100%" }}
            >
              View Movement History
            </Button>
          </Space>
        </Form.Item>

        {/* Exhibition Items Section */}
        <Form.Item label="Exhibition Details">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setShowExhibitionItemModal(true)}
              style={{ width: "100%" }}
            >
              Manage Exhibition Display
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <LocationCreateModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSuccess={handleLocationCreated}
      />

      <ContactCreateModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSuccess={handleContactSuccess}
      />

      <LoanCreateModal
        open={showLoanModal}
        onClose={() => setShowLoanModal(false)}
        onSuccess={handleLoanCreated}
      />

      <MovementCreateModal
        open={showMovementModal}
        onClose={() => setShowMovementModal(false)}
        onSuccess={fetchMovementHistory}
        itemId={String(id)}
      />

      <ExhibitionItemModal
        open={showExhibitionItemModal}
        onClose={() => setShowExhibitionItemModal(false)}
        onSuccess={fetchExhibitionItems}
        itemId={String(id)}
      />

      <MovementHistoryModal
        open={movementHistory.length > 0}
        onClose={() => setMovementHistory([])}
        movements={movementHistory}
      />
    </Edit>
  );
};

// Movement creation modal component
const MovementCreateModal = ({
  open,
  onClose,
  onSuccess,
  itemId,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemId?: string;
}) => {
  const [form] = Form.useForm();
  const { mutate: createMovement, isLoading } = useCreate();

  const { selectProps: locationSelectProps } = useSelect({
    resource: "locations",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: contactSelectProps } = useSelect({
    resource: "contacts",
    optionLabel: "name",
    optionValue: "id",
  });

  const handleSubmit = async (values: any) => {
    createMovement(
      {
        resource: "item_movements",
        values: {
          ...values,
          item_id: itemId,
          movement_date: values.movement_date?.format("YYYY-MM-DD HH:mm:ss"),
        },
      },
      {
        onSuccess: () => {
          message.success("Movement recorded successfully");
          onSuccess();
          form.resetFields();
          onClose();
        },
        onError: (error) => {
          console.error("Movement creation error:", error);
          message.error("Failed to record movement");
        },
      },
    );
  };

  return (
    <Modal
      title="Record Item Movement"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="From Location"
          name="from_location_id"
          rules={[{ required: true, message: "Please select from location" }]}
        >
          <Select placeholder="Select from location" {...locationSelectProps} />
        </Form.Item>

        <Form.Item
          label="To Location"
          name="to_location_id"
          rules={[{ required: true, message: "Please select to location" }]}
        >
          <Select placeholder="Select to location" {...locationSelectProps} />
        </Form.Item>

        <Form.Item
          label="Movement Date"
          name="movement_date"
          initialValue={dayjs()}
          rules={[{ required: true, message: "Please select movement date" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Moved By" name="moved_by_contact_id">
          <Select
            placeholder="Select person responsible"
            {...contactSelectProps}
          />
        </Form.Item>

        <Form.Item
          label="Reason"
          name="reason"
          rules={[
            { required: true, message: "Please enter reason for movement" },
          ]}
        >
          <Select
            options={[
              { label: "Exhibition Installation", value: "exhibition_install" },
              { label: "Storage", value: "storage" },
              { label: "Conservation", value: "conservation" },
              { label: "Loan", value: "loan" },
              { label: "Photography", value: "photography" },
              { label: "Research", value: "research" },
              { label: "Other", value: "other" },
            ]}
            placeholder="Select movement reason"
          />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <Input.TextArea
            rows={3}
            placeholder="Additional notes about the movement"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Record Movement
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Exhibition item modal component
const ExhibitionItemModal = ({
  open,
  onClose,
  onSuccess,
  itemId,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemId?: string;
}) => {
  const [form] = Form.useForm();
  const { mutate: createExhibitionItem, isLoading } = useCreate();

  const { selectProps: exhibitionSelectProps } = useSelect({
    resource: "exhibitions",
    optionLabel: "name",
    optionValue: "id",
  });

  const handleSubmit = async (values: any) => {
    createExhibitionItem(
      {
        resource: "exhibition_items",
        values: {
          ...values,
          item_id: itemId,
          date_installed: values.date_installed?.format("YYYY-MM-DD"),
          date_removed: values.date_removed?.format("YYYY-MM-DD"),
        },
      },
      {
        onSuccess: () => {
          message.success("Exhibition item details added successfully");
          onSuccess();
          form.resetFields();
          onClose();
        },
        onError: (error) => {
          console.error("Exhibition item creation error:", error);
          message.error("Failed to add exhibition item details");
        },
      },
    );
  };

  return (
    <Modal
      title="Manage Exhibition Display Details"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Exhibition"
          name="exhibition_id"
          rules={[{ required: true, message: "Please select an exhibition" }]}
        >
          <Select placeholder="Select exhibition" {...exhibitionSelectProps} />
        </Form.Item>

        <Form.Item label="Display Order" name="display_order">
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Order in exhibition"
          />
        </Form.Item>

        <Form.Item label="Display Location" name="display_location">
          <Input placeholder="e.g., Main Gallery Wall 3, Pedestal 2" />
        </Form.Item>

        <Form.Item
          label="Item Role"
          name="item_role"
          rules={[{ required: true, message: "Please select item role" }]}
        >
          <Select
            options={[
              { label: "Featured", value: "featured" },
              { label: "Supporting", value: "supporting" },
              { label: "Context", value: "context" },
              { label: "Loan", value: "loan" },
            ]}
            placeholder="Select role in exhibition"
          />
        </Form.Item>

        <Form.Item label="Exhibition Label Text" name="label_text">
          <Input.TextArea
            rows={4}
            placeholder="Display label for this exhibition"
          />
        </Form.Item>

        <Form.Item
          label="Date Installed"
          name="date_installed"
          rules={[
            { required: true, message: "Please select installation date" },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Date Removed" name="date_removed">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Installation Notes" name="installation_notes">
          <Input.TextArea
            rows={3}
            placeholder="Special installation requirements or notes"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Save Exhibition Details
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Movement history modal component
const MovementHistoryModal = ({
  open,
  onClose,
  movements,
}: {
  open: boolean;
  onClose: () => void;
  movements: any[];
}) => {
  const { Title } = Typography;

  const columns = [
    {
      title: "Date",
      dataIndex: "movement_date",
      key: "movement_date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      width: 120,
    },
    {
      title: "From",
      dataIndex: "from_location",
      key: "from_location",
      render: (location: any) => location?.name || "Unknown",
      width: 120,
    },
    {
      title: "To",
      dataIndex: "to_location",
      key: "to_location",
      render: (location: any) => location?.name || "Unknown",
      width: 120,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 100,
    },
    {
      title: "Moved By",
      dataIndex: "moved_by",
      key: "moved_by",
      render: (contact: any) => contact?.name || "Unknown",
      width: 100,
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (text: string) => (
        <Tooltip title={text}>
          <div
            style={{
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text || "-"}
          </div>
        </Tooltip>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <HistoryOutlined style={{ marginRight: 8 }} />
          Movement History
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Table
        dataSource={movements}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ y: 400 }}
        size="small"
      />
    </Modal>
  );
};
