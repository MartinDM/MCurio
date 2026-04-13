import { useModalForm, useSelect } from "@refinedev/antd";
import { useGo, useGetIdentity, useList } from "@refinedev/core";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useItemCount } from "@/hooks/useItemCount";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

import { Form, Input, Modal, Select, Alert } from "antd";

const ITEM_TYPE_OPTIONS = [
  { label: "Art Piece", value: "art_piece" },
  { label: "Object", value: "object" },
  { label: "Photograph", value: "photograph" },
  { label: "Document", value: "document" },
];

export const ItemCreateModal = () => {
  const go = useGo();
  const { completeStep } = useOnboarding();
  const { data: identity } = useGetIdentity();
  const { itemUsage, loading: itemCountLoading, refetch } = useItemCount();

  const goToListPage = () => {
    go({
      to: { resource: "items", action: "list" },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const handleSuccess = () => {
    // Complete onboarding step when first item is created
    completeStep("add_first_item");
    // Refetch item count after successful creation
    refetch();
    goToListPage();
  };

  const { formProps, modalProps } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "items",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: handleSuccess,
  });

  // Set current user as default owner when form and staff list are ready
  useEffect(() => {
    if (identity?.id && museumStaff.length > 0 && formProps.form) {
      const currentUserInStaff = museumStaff.find(
        (staff) => staff.id === identity.id,
      );
      if (currentUserInStaff) {
        formProps.form.setFieldValue("owner_id", identity.id);
      } else if (museumStaff.length > 0) {
        // If current user isn't in staff list, default to first staff member
        formProps.form.setFieldValue("owner_id", museumStaff[0].id);
      }
    }
  }, [identity?.id, museumStaff, formProps.form]);

  // State for museum staff
  const [museumStaff, setMuseumStaff] = useState<
    Array<{ id: string; display_name: string; role?: string }>
  >([]);
  const [staffLoading, setStaffLoading] = useState(true);

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

  // Contact selection for external contacts
  const { selectProps: contactSelectProps } = useSelect({
    resource: "contacts",
    optionLabel: "name",
    optionValue: "id",
  });

  const itemType = Form.useWatch("item_type", formProps.form) ?? "art_piece";

  // Check item limit status
  const canCreateItems = itemUsage?.canCreateMore ?? true;
  const isAtLimit = itemUsage?.isAtLimit ?? false;
  const currentCount = itemUsage?.currentCount ?? 0;
  const maxItems = itemUsage?.maxItems ?? 20;
  const planType = itemUsage?.planType ?? "personal";

  return (
    <Modal
      {...modalProps}
      mask={true}
      onCancel={goToListPage}
      title="Add new item"
      width={512}
      okButtonProps={{
        disabled: !canCreateItems || itemCountLoading,
        loading: itemCountLoading,
        ...modalProps.okButtonProps,
      }}
    >
      {/* Show current usage */}
      {itemUsage && (
        <Alert
          message={`${currentCount} of ${maxItems} items used (${
            planType === "personal" ? "Personal" : "Museum"
          } Plan)`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Show limit warning */}
      {isAtLimit && (
        <Alert
          message="Item limit reached"
          description={`You've reached your ${
            planType === "personal" ? "Personal" : "Museum"
          } plan limit of ${maxItems} items. Upgrade your plan to add more items.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={<a href="/pricing">View Plans</a>}
        />
      )}

      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          item_type: "art_piece",
          // owner_id will be set dynamically
        }}
      >
        <Form.Item
          label="Item type"
          name="item_type"
          rules={[{ required: true }]}
          initialValue="art_piece"
        >
          <Select options={ITEM_TYPE_OPTIONS} placeholder="Select item type" />
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
                <div>{option.data?.display_name || "Unnamed User"}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {option.data?.role || "Staff Member"}
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
            showSearch
            filterOption={(input, option) => {
              const name = option?.data?.name || "";
              const org = option?.data?.organization || "";
              return (
                name.toLowerCase().includes(input.toLowerCase()) ||
                org.toLowerCase().includes(input.toLowerCase())
              );
            }}
            {...contactSelectProps}
            optionRender={(option) => (
              <div>
                <div>{option.data?.name}</div>
                {option.data?.organization && (
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {option.data.organization}
                  </div>
                )}
                {option.data?.type && (
                  <div style={{ fontSize: "11px", color: "#999" }}>
                    {option.data.type}
                  </div>
                )}
              </div>
            )}
          />
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
