import { useEffect, useMemo, useState } from "react";

import { useParsed } from "@refinedev/core";

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
} from "antd";

import { supabase } from "@/lib/supabase";

type PropertyDefinition = {
  id: string;
  name: string;
  type: "text" | "place" | "number" | "boolean";
};

type PropertyValueRow = {
  property_id: string;
  value_text?: string;
  value_number?: number;
  value_boolean?: boolean;
};

export const ItemContactsTable = () => {
  const { id } = useParsed();
  const [form] = Form.useForm<{ values: PropertyValueRow[] }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [properties, setProperties] = useState<PropertyDefinition[]>([]);

  const propertyTypeById = useMemo(
    () =>
      Object.fromEntries(
        properties.map((property) => [property.id, property.type]),
      ),
    [properties],
  );

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        return;
      }

      try {
        const [
          { data: propertyRows, error: propertiesError },
          { data: valueRows, error: valuesError },
        ] = await Promise.all([
          supabase
            .from("properties")
            .select("id,name,type")
            .order("sort_order", { ascending: true })
            .order("name", { ascending: true }),
          supabase
            .from("item_property_values")
            .select("property_id,value_text,value_number,value_boolean")
            .eq("item_id", id),
        ]);

        if (propertiesError) {
          throw propertiesError;
        }

        if (valuesError) {
          throw valuesError;
        }

        setProperties((propertyRows ?? []) as PropertyDefinition[]);
        form.setFieldsValue({
          values: (valueRows ?? []) as PropertyValueRow[],
        });
      } catch (_error) {
        message.error("Failed to load item properties.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [form, id]);

  const savePropertyValues = async () => {
    if (!id) {
      return;
    }

    setIsSaving(true);
    try {
      const values = await form.validateFields();
      const rows = values.values ?? [];

      const uniqueIds = new Set(rows.map((row) => row.property_id));
      if (uniqueIds.size !== rows.length) {
        message.error("Each property can only be selected once.");
        return;
      }

      const { data: item, error: itemError } = await supabase
        .from("items")
        .select("museum_id")
        .eq("id", id)
        .single();

      if (itemError) {
        throw itemError;
      }

      const { error: deleteError } = await supabase
        .from("item_property_values")
        .delete()
        .eq("item_id", id);

      if (deleteError) {
        throw deleteError;
      }

      if (rows.length > 0) {
        const insertRows = rows.map((row) => {
          const propertyType = propertyTypeById[row.property_id];

          return {
            item_id: id,
            property_id: row.property_id,
            value_text:
              propertyType === "text" || propertyType === "place"
                ? row.value_text
                : null,
            value_number: propertyType === "number" ? row.value_number : null,
            value_boolean:
              propertyType === "boolean" ? row.value_boolean : null,
            museum_id: item.museum_id,
          };
        });

        const { error: insertError } = await supabase
          .from("item_property_values")
          .insert(insertRows);

        if (insertError) {
          throw insertError;
        }
      }

      message.success("Item properties saved.");
    } catch (_error) {
      message.error("Failed to save item properties.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      title="Properties"
      loading={isLoading}
      extra={
        <Button onClick={savePropertyValues} loading={isSaving} type="primary">
          Save properties
        </Button>
      }
    >
      <Form form={form} layout="vertical">
        <Form.List name="values">
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              {fields.map((field) => {
                return (
                  <Card key={field.key} size="small">
                    <Form.Item
                      {...field}
                      label="Property"
                      name={[field.name, "property_id"]}
                      rules={[
                        { required: true, message: "Property is required" },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Select property"
                        options={properties.map((property) => ({
                          label: `${property.name} (${property.type})`,
                          value: property.id,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(previousValues, currentValues) =>
                        previousValues?.values?.[field.name]?.property_id !==
                        currentValues?.values?.[field.name]?.property_id
                      }
                    >
                      {() => {
                        const selectedPropertyId = form.getFieldValue([
                          "values",
                          field.name,
                          "property_id",
                        ]);
                        const propertyType =
                          propertyTypeById[selectedPropertyId];

                        if (
                          propertyType === "text" ||
                          propertyType === "place"
                        ) {
                          return (
                            <Form.Item
                              {...field}
                              label={
                                propertyType === "place"
                                  ? "Place value"
                                  : "Text value"
                              }
                              name={[field.name, "value_text"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Value is required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter value" />
                            </Form.Item>
                          );
                        }

                        if (propertyType === "number") {
                          return (
                            <Form.Item
                              {...field}
                              label="Number value"
                              name={[field.name, "value_number"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Value is required",
                                },
                              ]}
                            >
                              <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                          );
                        }

                        if (propertyType === "boolean") {
                          return (
                            <Form.Item
                              {...field}
                              label="Boolean value"
                              name={[field.name, "value_boolean"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Value is required",
                                },
                              ]}
                            >
                              <Select
                                options={[
                                  { label: "Yes", value: true },
                                  { label: "No", value: false },
                                ]}
                              />
                            </Form.Item>
                          );
                        }

                        return null;
                      }}
                    </Form.Item>

                    <Button danger onClick={() => remove(field.name)}>
                      Remove
                    </Button>
                  </Card>
                );
              })}

              <Button
                onClick={() =>
                  add({
                    property_id: undefined,
                    value_text: undefined,
                    value_number: undefined,
                    value_boolean: undefined,
                  })
                }
              >
                Add property
              </Button>
            </Space>
          )}
        </Form.List>
      </Form>
    </Card>
  );
};
