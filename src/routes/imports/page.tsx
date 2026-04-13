import { useMemo, useState } from "react";

import { List } from "@refinedev/antd";
import {
  Alert,
  Card,
  Col,
  Divider,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
} from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";

type ImportEntity =
  | "object"
  | "person"
  | "place"
  | "exhibition"
  | "provenance_event"
  | "custom";

type MappingField = {
  label: string;
  value: string;
};

type ColumnMapping = {
  column: string;
  entity: ImportEntity;
  field: string;
  confidence: "high" | "medium" | "low";
};

type ParsedCsv = {
  headers: string[];
  rows: string[][];
};

const ENTITY_OPTIONS: { label: string; value: ImportEntity }[] = [
  { label: "Object", value: "object" },
  { label: "Person / Organisation", value: "person" },
  { label: "Place", value: "place" },
  { label: "Exhibition", value: "exhibition" },
  { label: "Provenance Event", value: "provenance_event" },
  { label: "Custom Metadata", value: "custom" },
];

const FIELD_OPTIONS: Record<ImportEntity, MappingField[]> = {
  object: [
    { label: "Title", value: "title" },
    { label: "Accession Number", value: "accession_number" },
    { label: "Description", value: "description" },
    { label: "Date Made", value: "date_made" },
    { label: "Materials", value: "materials" },
    { label: "Current Location", value: "current_location_id" },
  ],
  person: [
    { label: "Name", value: "name" },
    { label: "Maker Relationship", value: "maker_relationship" },
    { label: "Creator Relationship", value: "creator_relationship" },
    { label: "Manufacturer Relationship", value: "manufacturer_relationship" },
    { label: "Biography / Notes", value: "notes" },
  ],
  place: [
    { label: "Place Name", value: "name" },
    { label: "Place of Creation", value: "place_of_creation" },
    { label: "Place of Discovery", value: "place_of_discovery" },
    { label: "Region / Country", value: "region" },
  ],
  exhibition: [
    { label: "Exhibition Title", value: "title" },
    { label: "Exhibition Code", value: "code" },
    { label: "Exhibition Section", value: "section" },
  ],
  provenance_event: [
    { label: "Acquisition Method", value: "acquisition_method" },
    { label: "Owner / Holder", value: "owner_or_holder" },
    { label: "Event Date", value: "event_date" },
    { label: "Provenance Note", value: "note" },
  ],
  custom: [
    { label: "Preserve as Custom Field", value: "custom_field" },
    { label: "Preserve as Source Note", value: "source_note" },
  ],
};

const guessMapping = (column: string): ColumnMapping => {
  const key = column.trim().toLowerCase();

  if (
    ["title", "object_title", "name", "object_name"].includes(key) ||
    key.endsWith("_title")
  ) {
    return {
      column,
      entity: "object",
      field: "title",
      confidence: "high",
    };
  }

  if (
    [
      "accession_number",
      "accession_no",
      "object_number",
      "catalogue_number",
    ].includes(key)
  ) {
    return {
      column,
      entity: "object",
      field: "accession_number",
      confidence: "high",
    };
  }

  if (
    key.includes("maker") ||
    key.includes("artist") ||
    key.includes("creator")
  ) {
    return {
      column,
      entity: "person",
      field: "maker_relationship",
      confidence: "medium",
    };
  }

  if (key.includes("manufacturer") || key.includes("workshop")) {
    return {
      column,
      entity: "person",
      field: "manufacturer_relationship",
      confidence: "medium",
    };
  }

  if (
    key.includes("place") ||
    key.includes("origin") ||
    key.includes("location")
  ) {
    return {
      column,
      entity: "place",
      field: "place_of_creation",
      confidence: "medium",
    };
  }

  if (
    key.includes("provenance") ||
    key.includes("owner") ||
    key.includes("acquisition")
  ) {
    return {
      column,
      entity: "provenance_event",
      field: "note",
      confidence: "medium",
    };
  }

  if (key.includes("description") || key.includes("note")) {
    return {
      column,
      entity: "object",
      field: "description",
      confidence: "medium",
    };
  }

  return {
    column,
    entity: "custom",
    field: "custom_field",
    confidence: "low",
  };
};

const parseCsvLine = (line: string) => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());

  return values;
};

const parseCsv = (content: string): ParsedCsv => {
  const lines = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => parseCsvLine(line));

  return { headers, rows };
};

const confidenceColor: Record<ColumnMapping["confidence"], string> = {
  high: "green",
  medium: "gold",
  low: "default",
};

export const ImportListPage = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<ParsedCsv>({ headers: [], rows: [] });
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const uploadProps: UploadProps = {
    accept: ".csv,text/csv",
    maxCount: 1,
    showUploadList: false,
    beforeUpload: async (file) => {
      try {
        const content = await file.text();
        const parsed = parseCsv(content);

        if (parsed.headers.length === 0) {
          setParseError(
            "This file appears to be empty or missing a header row.",
          );
          setFileName(file.name);
          setCsvData({ headers: [], rows: [] });
          setMappings([]);
          return false;
        }

        setParseError(null);
        setFileName(file.name);
        setCsvData(parsed);
        setMappings(parsed.headers.map((header) => guessMapping(header)));
      } catch {
        setParseError(
          "MCurio could not read this file. Please try another CSV.",
        );
      }

      return false;
    },
  };

  const mappingRows = useMemo(
    () =>
      mappings.map((mapping, index) => ({
        key: mapping.column,
        mapping,
        sample:
          csvData.rows.find(
            (row) => row[index] && row[index].trim().length > 0,
          )?.[index] ?? "No sample value",
      })),
    [csvData.rows, mappings],
  );

  const previewColumns = useMemo(
    () =>
      csvData.headers.slice(0, 6).map((header, index) => ({
        title: header,
        dataIndex: `column-${index}`,
        key: header,
        render: (value: string) => value || "—",
      })),
    [csvData.headers],
  );

  const previewRows = useMemo(
    () =>
      csvData.rows.slice(0, 5).map((row, rowIndex) => {
        const record: Record<string, string> = { key: `${rowIndex}` };

        csvData.headers.slice(0, 6).forEach((_, columnIndex) => {
          record[`column-${columnIndex}`] = row[columnIndex] ?? "";
        });

        return record;
      }),
    [csvData.headers, csvData.rows],
  );

  const unsupportedColumns = mappings.filter(
    (mapping) => mapping.entity === "custom",
  ).length;

  return (
    <List title="Imports">
      <Space direction="vertical" size={24} style={{ display: "flex" }}>
        <Alert
          type="info"
          showIcon
          message="Import and map a CSV file"
          description="Upload a spreadsheet export, review MCurio's suggested mappings, and preserve unsupported columns as custom metadata instead of losing them."
        />

        <Card bordered={false}>
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#735c28" }} />
            </p>
            <p className="ant-upload-text">
              Drop a CSV here or click to choose a file
            </p>
            <p className="ant-upload-hint">
              Best for collection exports with header rows such as object title,
              accession number, maker, place, provenance, or exhibition data.
            </p>
          </Upload.Dragger>

          {fileName ? (
            <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
              Loaded file: <strong>{fileName}</strong>
            </Typography.Paragraph>
          ) : null}

          {parseError ? (
            <Alert
              style={{ marginTop: 16 }}
              type="error"
              showIcon
              message={parseError}
            />
          ) : null}
        </Card>

        {mappings.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              <Col xs={24} xl={16}>
                <Card
                  title="Column Mapping"
                  extra={
                    <Tag color={unsupportedColumns > 0 ? "gold" : "green"}>
                      {unsupportedColumns} custom fields
                    </Tag>
                  }
                >
                  <Table
                    dataSource={mappingRows}
                    pagination={false}
                    scroll={{ x: 900 }}
                    rowKey="key"
                  >
                    <Table.Column
                      title="CSV Column"
                      dataIndex={["mapping", "column"]}
                    />
                    <Table.Column
                      title="Sample"
                      dataIndex="sample"
                      render={(value: string) => (
                        <Typography.Text
                          type={
                            value === "No sample value"
                              ? "secondary"
                              : undefined
                          }
                        >
                          {value}
                        </Typography.Text>
                      )}
                    />
                    <Table.Column
                      title="Entity"
                      render={(_, record: { mapping: ColumnMapping }) => (
                        <Select
                          value={record.mapping.entity}
                          options={ENTITY_OPTIONS}
                          style={{ minWidth: 190 }}
                          onChange={(entity) => {
                            setMappings((currentMappings) =>
                              currentMappings.map((mapping) =>
                                mapping.column === record.mapping.column
                                  ? {
                                      ...mapping,
                                      entity,
                                      field:
                                        FIELD_OPTIONS[entity][0]?.value ?? "",
                                    }
                                  : mapping,
                              ),
                            );
                          }}
                        />
                      )}
                    />
                    <Table.Column
                      title="Target Field"
                      render={(_, record: { mapping: ColumnMapping }) => (
                        <Select
                          value={record.mapping.field}
                          options={FIELD_OPTIONS[record.mapping.entity]}
                          style={{ minWidth: 220 }}
                          onChange={(field) => {
                            setMappings((currentMappings) =>
                              currentMappings.map((mapping) =>
                                mapping.column === record.mapping.column
                                  ? {
                                      ...mapping,
                                      field,
                                    }
                                  : mapping,
                              ),
                            );
                          }}
                        />
                      )}
                    />
                    <Table.Column
                      title="Confidence"
                      render={(_, record: { mapping: ColumnMapping }) => (
                        <Tag color={confidenceColor[record.mapping.confidence]}>
                          {record.mapping.confidence}
                        </Tag>
                      )}
                    />
                  </Table>
                </Card>
              </Col>

              <Col xs={24} xl={8}>
                <Card title="Import Notes">
                  <Space
                    direction="vertical"
                    size={14}
                    style={{ display: "flex" }}
                  >
                    <Typography.Paragraph style={{ margin: 0 }}>
                      MCurio suggests mappings based on column names and keeps
                      unknown columns attached to the same entity as custom
                      metadata.
                    </Typography.Paragraph>
                    <Divider style={{ margin: 0 }} />
                    <div>
                      <Typography.Text strong>Review first</Typography.Text>
                      <Typography.Paragraph
                        type="secondary"
                        style={{ marginBottom: 0 }}
                      >
                        Confirm maker, place, provenance, and exhibition
                        columns, especially when the spreadsheet comes from a
                        legacy system.
                      </Typography.Paragraph>
                    </div>
                    <div>
                      <Typography.Text strong>
                        Preserve what does not fit
                      </Typography.Text>
                      <Typography.Paragraph
                        type="secondary"
                        style={{ marginBottom: 0 }}
                      >
                        Unsupported fields can stay as custom metadata now and
                        be promoted into structured fields later.
                      </Typography.Paragraph>
                    </div>
                    <div>
                      <Typography.Text strong>
                        Next implementation step
                      </Typography.Text>
                      <Typography.Paragraph
                        type="secondary"
                        style={{ marginBottom: 0 }}
                      >
                        Save mapping templates per institution and add row-level
                        validation before writing imports into the database.
                      </Typography.Paragraph>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Card title="Preview">
              <Table
                columns={previewColumns}
                dataSource={previewRows}
                pagination={false}
                scroll={{ x: 900 }}
                locale={{ emptyText: "No preview rows available." }}
              />
            </Card>
          </>
        ) : null}
      </Space>
    </List>
  );
};
