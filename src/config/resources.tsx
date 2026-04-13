import type { IResourceItem } from "@refinedev/core";
import { MdOutlineMuseum } from "react-icons/md";
import { HiCollection } from "react-icons/hi";
import { ImProfile } from "react-icons/im";
import { BsPersonRaisedHand } from "react-icons/bs";

import {
  ApartmentOutlined,
  IdcardOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  ImportOutlined,
  TagsOutlined,
  TagOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

// Base resources available to all plans
export const getBaseResources = (): IResourceItem[] => [
  {
    name: "dashboard",
    list: "/dashboard",
    meta: {
      label: "Museum Management",
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "items",
    list: "/items",
    create: "/items/new",
    edit: "/items/edit/:id",
    meta: {
      label: "Items",
      icon: <TagsOutlined />,
    },
  },
  {
    name: "contacts",
    list: "/contacts",
    create: "/contacts/new",
    edit: "/contacts/edit/:id",
    meta: {
      label: "Contacts",
      icon: <UserOutlined />,
    },
  },
  {
    name: "locations",
    list: "/locations",
    create: "/locations/new",
    edit: "/locations/edit/:id",
    meta: {
      label: "Locations",
      icon: <ApartmentOutlined />,
    },
  },
  {
    name: "tags",
    list: "/tags",
    create: "/tags/new",
    edit: "/tags/edit/:id",
    meta: {
      label: "Tags",
      icon: <TagOutlined />,
    },
  },
  {
    name: "properties",
    list: "/properties",
    create: "/properties/new",
    edit: "/properties/edit/:id",
    meta: {
      label: "Properties",
      icon: <ApartmentOutlined />,
    },
  },
];

// Museum-only resources
export const getMuseumResources = (): IResourceItem[] => [
  {
    name: "condition_reports",
    list: "/condition-reports",
    create: "/condition-reports/new",
    edit: "/condition-reports/edit/:id",
    meta: {
      label: "Condition Reports",
      icon: <FileSearchOutlined />,
    },
  },
  {
    name: "loans",
    list: "/loans",
    create: "/loans/new",
    edit: "/loans/edit/:id",
    meta: {
      label: "Loans",
      icon: <FileTextOutlined />,
    },
  },
  {
    name: "exhibitions",
    list: "/exhibitions",
    create: "/exhibitions/new",
    edit: "/exhibitions/edit/:id",
    meta: {
      label: "Exhibitions",
      icon: <HiCollection />,
    },
  },
];

// Admin resources (always available)
export const getAdminResources = (): IResourceItem[] => [
  {
    name: "museums",
    list: "/museums",
    create: "/museums/new",
    edit: "/museums/edit/:id",
    meta: {
      label: "Museums",
      icon: <MdOutlineMuseum />,
    },
  },
  {
    name: "colleagues",
    list: "/colleagues",
    create: "/colleagues/new",
    edit: "/colleagues/edit/:id",
    meta: {
      label: "Colleagues",
      icon: <BsPersonRaisedHand />,
    },
  },
  {
    name: "profiles",
    list: "/profiles",
    create: "/profiles/new",
    edit: "/profiles/edit/:id",
    meta: {
      label: "Profiles",
      icon: <ImProfile />,
    },
  },
  {
    name: "roles",
    list: "/roles",
    create: "/roles/new",
    edit: "/roles/edit/:id",
    meta: {
      label: "Roles",
      icon: <IdcardOutlined />,
    },
  },
  {
    name: "imports",
    list: "/imports",
    meta: {
      label: "Imports",
      icon: <ImportOutlined />,
    },
  },
  {
    name: "settings",
    list: "/settings",
    meta: {
      label: "Settings",
      icon: <SettingOutlined />,
    },
  },
];

// Get resources based on plan type
export const getResourcesForPlan = (
  planType: "personal" | "museum" = "personal",
): IResourceItem[] => {
  const baseResources = getBaseResources();
  const adminResources = getAdminResources();

  if (planType === "museum") {
    return [...baseResources, ...getMuseumResources(), ...adminResources];
  }

  return [...baseResources, ...adminResources];
};

// Legacy export for backward compatibility
export const resources: IResourceItem[] = getResourcesForPlan("museum");
