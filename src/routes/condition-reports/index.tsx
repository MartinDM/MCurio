import {
  Create,
  CreateButton,
  DeleteButton,
  Edit,
  EditButton,
  List,
  useForm,
  useTable,
} from "@refinedev/antd";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tag,
  Table,
} from "antd";
import type { TableColumnsType } from "antd";
import dayjs, { Dayjs } from "dayjs";

type ConditionReport = {
  id: string;
  item_id: string;
  date: string;
  status?: string | null;
  notes?: string | null;
  temperature?: number | null;
  humidity?: number | null;
};

const STATUS_OPTIONS = [
  { label: "Excellent", value: "excellent" },
  { label: "Stable", value: "stable" },
  { label: "Needs Attention", value: "needs_attention" },
];

const STATUS_COLORS: Record<string, string> = {
  excellent: "green",
  stable: "blue",
  needs_attention: "gold",
};

export const ConditionReportListPage = () => {
  const { tableProps } = useTable<ConditionReport>({
    resource: "condition_reports",
  });

  const columns: TableColumnsType<ConditionReport> = [
    {
      key: "date",
      dataIndex: "date",
      title: "Date",
      defaultSortOrder: "descend",
      sorter: (first, second) =>
        dayjs(first.date).valueOf() - dayjs(second.date).valueOf(),
      render: (value: string) => dayjs(value).format("MMM DD, YYYY"),
    },
    {
      key: "item_id",
      dataIndex: "item_id",
      title: "Item ID",
      sorter: (first, second) => first.item_id.localeCompare(second.item_id),
      responsive: ["md"],
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      filters: STATUS_OPTIONS.map((option) => ({
        text: option.label,
        value: option.value,
      })),
      onFilter: (value, record) => record.status === value,
      sorter: (first, second) =>
        (first.status ?? "").localeCompare(second.status ?? ""),
      render: (value?: string | null) => {
        if (!value) {
          return <Tag>Unknown</Tag>;
        }

        return (
          <Tag color={STATUS_COLORS[value] ?? "default"}>
            {value.replaceAll("_", " ")}
          </Tag>
        );
      },
    },
    {
      key: "temperature",
      dataIndex: "temperature",
      title: "Temp (°C)",
      sorter: (first, second) =>
        (first.temperature ?? Number.NEGATIVE_INFINITY) -
        (second.temperature ?? Number.NEGATIVE_INFINITY),
      align: "right",
    },
    {
      key: "humidity",
      dataIndex: "humidity",
      title: "Humidity (%)",
      sorter: (first, second) =>
        (first.humidity ?? Number.NEGATIVE_INFINITY) -
        (second.humidity ?? Number.NEGATIVE_INFINITY),
      align: "right",
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, record) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <List headerButtons={<CreateButton />}>
      <Table
        {...tableProps}
        columns={columns}
        rowKey="id"
        scroll={{ x: 900 }}
        sortDirections={["ascend", "descend"]}
      />
    </List>
  );
};

export const ConditionReportCreatePage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "condition_reports",
    redirect: "list",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Item ID" name="item_id" rules={[{ required: true }]}>
          <Input placeholder="Enter item ID" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true }]}
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
          <Select placeholder="Select status" options={STATUS_OPTIONS} />
        </Form.Item>
        <Form.Item label="Temperature (°C)" name="temperature">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Humidity (%)" name="humidity">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea placeholder="Enter notes" rows={4} />
        </Form.Item>
      </Form>
    </Create>
  );
};

export const ConditionReportEditPage = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "condition_reports",
    redirect: "list",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Item ID" name="item_id" rules={[{ required: true }]}>
          <Input placeholder="Enter item ID" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true }]}
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
          <Select placeholder="Select status" options={STATUS_OPTIONS} />
        </Form.Item>
        <Form.Item label="Temperature (°C)" name="temperature">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Humidity (%)" name="humidity">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea placeholder="Enter notes" rows={4} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
