import { useEffect, useMemo, useState } from "react";

import {
  Create,
  CreateButton,
  DeleteButton,
  Edit,
  EditButton,
  List,
  useSelect,
  useTable,
} from "@refinedev/antd";
import { useGo, useParsed } from "@refinedev/core";

import {
  DatePicker,
  Form,
  Input,
  type SelectProps,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";

import { supabase } from "@/lib/supabase";

type Loan = {
  id: string;
  reference_code?: string | null;
  contact_id: string;
  loan_type: "incoming" | "outgoing";
  status: "draft" | "active" | "returned" | "cancelled";
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  created_at?: string;
};

type LoanFormValues = {
  reference_code?: string;
  contact_id: string;
  loan_type: "incoming" | "outgoing";
  status: "draft" | "active" | "returned" | "cancelled";
  start_date?: string | null;
  end_date?: string | null;
  notes?: string;
  item_ids: string[];
};

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Returned", value: "returned" },
  { label: "Cancelled", value: "cancelled" },
];

const TYPE_OPTIONS = [
  { label: "Incoming", value: "incoming" },
  { label: "Outgoing", value: "outgoing" },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "default",
  active: "blue",
  returned: "green",
  cancelled: "red",
};

const getCurrentMuseumId = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("museum_id")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return profile?.museum_id ?? null;
};

const LoanFields = ({
  contactSelectProps,
  itemSelectProps,
}: {
  contactSelectProps: SelectProps;
  itemSelectProps: SelectProps;
}) => {
  return (
    <>
      <Form.Item label="Reference code" name="reference_code">
        <Input placeholder="Example: LN-2026-001" />
      </Form.Item>

      <Form.Item
        label="Contact"
        name="contact_id"
        rules={[{ required: true, message: "Contact is required" }]}
      >
        <Select
          allowClear
          showSearch
          placeholder="Select contact"
          {...contactSelectProps}
        />
      </Form.Item>

      <Form.Item
        label="Items"
        name="item_ids"
        rules={[
          { required: true, message: "At least one item is required" },
          {
            validator: (_, value) => {
              if (Array.isArray(value) && value.length > 0) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("At least one item is required"));
            },
          },
        ]}
      >
        <Select
          mode="multiple"
          allowClear
          showSearch
          placeholder="Select one or more items"
          {...itemSelectProps}
        />
      </Form.Item>

      <Form.Item label="Loan type" name="loan_type" initialValue="outgoing">
        <Select options={TYPE_OPTIONS} />
      </Form.Item>

      <Form.Item label="Status" name="status" initialValue="draft">
        <Select options={STATUS_OPTIONS} />
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

      <Form.Item label="Notes" name="notes">
        <Input.TextArea rows={4} placeholder="Optional notes" />
      </Form.Item>
    </>
  );
};

export const LoanListPage = () => {
  const { tableProps } = useTable<Loan>({
    resource: "loans",
  });

  const columns = useMemo(
    () => [
      {
        key: "reference_code",
        dataIndex: "reference_code",
        title: "Reference",
      },
      {
        key: "contact_id",
        dataIndex: "contact_id",
        title: "Contact ID",
      },
      {
        key: "loan_type",
        dataIndex: "loan_type",
        title: "Type",
      },
      {
        key: "status",
        dataIndex: "status",
        title: "Status",
        render: (value: string) => (
          <Tag color={STATUS_COLORS[value] ?? "default"}>{value}</Tag>
        ),
      },
      {
        key: "start_date",
        dataIndex: "start_date",
        title: "Start",
      },
      {
        key: "end_date",
        dataIndex: "end_date",
        title: "End",
      },
      {
        key: "actions",
        title: "Actions",
        render: (_: unknown, record: Loan) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <DeleteButton hideText size="small" recordItemId={record.id} />
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <List headerButtons={<CreateButton />}>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </List>
  );
};

export const LoanCreatePage = () => {
  const go = useGo();
  const [form] = Form.useForm<LoanFormValues>();
  const [isSaving, setIsSaving] = useState(false);

  const { selectProps: contactSelectProps } = useSelect({
    resource: "contacts",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: itemSelectProps } = useSelect({
    resource: "items",
    optionLabel: "title",
    optionValue: "id",
  });

  const handleCreate = async (values: LoanFormValues) => {
    setIsSaving(true);
    try {
      const museumId = await getCurrentMuseumId();
      if (!museumId) {
        message.error("No museum linked to your profile.");
        return;
      }

      const { data: createdLoan, error: loanError } = await supabase
        .from("loans")
        .insert({
          reference_code: values.reference_code,
          contact_id: values.contact_id,
          loan_type: values.loan_type,
          status: values.status,
          start_date: values.start_date,
          end_date: values.end_date,
          notes: values.notes,
          museum_id: museumId,
        })
        .select("id")
        .single();

      if (loanError) {
        throw loanError;
      }

      const loanItemRows = values.item_ids.map((itemId) => ({
        loan_id: createdLoan.id,
        item_id: itemId,
        museum_id: museumId,
      }));

      const { error: loanItemsError } = await supabase
        .from("loan_items")
        .insert(loanItemRows);

      if (loanItemsError) {
        throw loanItemsError;
      }

      message.success("Loan created.");
      go({ to: { resource: "loans", action: "list" }, type: "replace" });
    } catch (error) {
      message.error("Failed to create loan.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Create
      saveButtonProps={{ onClick: () => form.submit(), loading: isSaving }}
    >
      <Form form={form} layout="vertical" onFinish={handleCreate}>
        <LoanFields
          contactSelectProps={contactSelectProps}
          itemSelectProps={itemSelectProps}
        />
      </Form>
    </Create>
  );
};

export const LoanEditPage = () => {
  const go = useGo();
  const { id } = useParsed();
  const [form] = Form.useForm<LoanFormValues>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { selectProps: contactSelectProps } = useSelect({
    resource: "contacts",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: itemSelectProps } = useSelect({
    resource: "items",
    optionLabel: "title",
    optionValue: "id",
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        return;
      }

      try {
        const { data: loan, error: loanError } = await supabase
          .from("loans")
          .select(
            "reference_code, contact_id, loan_type, status, start_date, end_date, notes",
          )
          .eq("id", id)
          .single();

        if (loanError) {
          throw loanError;
        }

        const { data: loanItems, error: loanItemsError } = await supabase
          .from("loan_items")
          .select("item_id")
          .eq("loan_id", id);

        if (loanItemsError) {
          throw loanItemsError;
        }

        form.setFieldsValue({
          ...loan,
          item_ids: (loanItems ?? []).map((row) => row.item_id),
        });
      } catch (_error) {
        message.error("Failed to load loan.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [form, id]);

  const handleUpdate = async (values: LoanFormValues) => {
    if (!id) {
      return;
    }

    setIsSaving(true);
    try {
      const { data: currentLoan, error: currentLoanError } = await supabase
        .from("loans")
        .select("museum_id")
        .eq("id", id)
        .single();

      if (currentLoanError) {
        throw currentLoanError;
      }

      const { error: updateError } = await supabase
        .from("loans")
        .update({
          reference_code: values.reference_code,
          contact_id: values.contact_id,
          loan_type: values.loan_type,
          status: values.status,
          start_date: values.start_date,
          end_date: values.end_date,
          notes: values.notes,
        })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      const { error: deleteError } = await supabase
        .from("loan_items")
        .delete()
        .eq("loan_id", id);

      if (deleteError) {
        throw deleteError;
      }

      const rows = values.item_ids.map((itemId) => ({
        loan_id: id,
        item_id: itemId,
        museum_id: currentLoan.museum_id,
      }));

      const { error: insertError } = await supabase
        .from("loan_items")
        .insert(rows);

      if (insertError) {
        throw insertError;
      }

      message.success("Loan updated.");
      go({ to: { resource: "loans", action: "list" }, type: "replace" });
    } catch (error) {
      message.error("Failed to update loan.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Edit
      isLoading={isLoading}
      saveButtonProps={{ onClick: () => form.submit(), loading: isSaving }}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <LoanFields
          contactSelectProps={contactSelectProps}
          itemSelectProps={itemSelectProps}
        />
      </Form>
    </Edit>
  );
};
