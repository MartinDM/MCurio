import type { IResourceItem } from "@refinedev/core";
import { MdOutlineMuseum } from "react-icons/md";
import { HiCollection } from "react-icons/hi";
import { ImProfile } from "react-icons/im";
import { BsPersonRaisedHand } from "react-icons/bs";

import {
  IdcardOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/dashboard",
    meta: {
      label: "Dashboard",
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
    name: "exhibitions",
    list: "/exhibitions",
    create: "/exhibitions/new",
    edit: "/exhibitions/edit/:id",
    meta: {
      label: "Exhibitions",
      icon: <HiCollection />,
    },
  },
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
];
