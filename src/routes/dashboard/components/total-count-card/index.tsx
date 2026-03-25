import React from "react";

import {
  ShopOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Area, type AreaConfig } from "@ant-design/plots";
import { Card, Skeleton } from "antd";

import { Text } from "@/components";

type Type = "items" | "exhibitions" | "museums";

type Props = {
  resource: Type;
  isLoading: boolean;
  totalCount?: number;
};

export const DashboardTotalCountCard = ({
  resource,
  isLoading,
  totalCount,
}: Props) => {
  const { primaryColor, secondaryColor, icon, title } = variants[resource];

  const config: AreaConfig = {
    appendPadding: [1, 0, 0, 0],
    padding: 0,
    syncViewPadding: true,
    data: variants[resource].data,
    autoFit: true,
    tooltip: false,
    animation: false,
    xField: "index",
    yField: "value",
    xAxis: false,
    yAxis: {
      tickCount: 12,
      label: {
        style: {
          fill: "transparent",
        },
      },
      grid: {
        line: {
          style: {
            stroke: "transparent",
          },
        },
      },
    },
    smooth: true,
    areaStyle: () => {
      return {
        fill: `l(270) 0:#fff 0.2:${secondaryColor} 1:${primaryColor}`,
      };
    },
    line: {
      color: primaryColor,
    },
  };

  return (
    <Card
      style={{ height: "96px", padding: 0 }}
      bodyStyle={{
        padding: "8px 8px 8px 12px",
      }}
      size="small"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
          {title}
        </Text>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text
          size="xxxl"
          strong
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "start",
            marginLeft: "48px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isLoading ? (
            <Skeleton.Button
              style={{
                marginTop: "8px",
                width: "74px",
              }}
            />
          ) : (
            totalCount
          )}
        </Text>
        <Area
          {...config}
          style={{
            width: "50%",
          }}
        />
      </div>
    </Card>
  );
};

const IconWrapper = ({
  color,
  children,
}: React.PropsWithChildren<{ color: string }>) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: color,
      }}
    >
      {children}
    </div>
  );
};

const variants: {
  [key in Type]: {
    primaryColor: string;
    secondaryColor?: string;
    icon: React.ReactNode;
    title: string;
    data: { index: string; value: number }[];
  };
} = {
  items: {
    primaryColor: "#1677FF",
    secondaryColor: "#BAE0FF",
    icon: (
      <IconWrapper color="#E6F4FF">
        <TagsOutlined
          className="md"
          style={{
            color: "#1677FF",
          }}
        />
      </IconWrapper>
    ),
    title: "Number of items",
    data: [
      { index: "1", value: 1800 },
      { index: "2", value: 2400 },
      { index: "3", value: 2100 },
      { index: "4", value: 2700 },
      { index: "5", value: 2600 },
    ],
  },
  exhibitions: {
    primaryColor: "#52C41A",
    secondaryColor: "#D9F7BE",
    icon: (
      <IconWrapper color="#F6FFED">
        <TeamOutlined
          className="md"
          style={{
            color: "#52C41A",
          }}
        />
      </IconWrapper>
    ),
    title: "Number of exhibitions",
    data: [
      { index: "1", value: 900 },
      { index: "2", value: 1200 },
      { index: "3", value: 1100 },
      { index: "4", value: 1400 },
      { index: "5", value: 1300 },
    ],
  },
  museums: {
    primaryColor: "#FA541C",
    secondaryColor: "#FFD8BF",
    icon: (
      <IconWrapper color="#FFF2E8">
        <ShopOutlined
          className="md"
          style={{
            color: "#FA541C",
          }}
        />
      </IconWrapper>
    ),
    title: "Number of museums",
    data: [
      { index: "1", value: 250 },
      { index: "2", value: 320 },
      { index: "3", value: 280 },
      { index: "4", value: 360 },
      { index: "5", value: 340 },
    ],
  },
};
