import React from "react";
import { useLocation, useNavigate } from "react-router";

import { useGetIdentity, useLogout, useResource } from "@refinedev/core";
import { Button, Divider, Layout, Menu, theme, Tag } from "antd";
import {
  LogoutOutlined,
  PushpinFilled,
  PushpinOutlined,
} from "@ant-design/icons";

import { supabase } from "@/lib/supabase";
import { useTrialStatus } from "@/hooks/useTrialStatus";

type SiderProps = {
  Title?: React.ComponentType<{ collapsed: boolean }>;
  meta?: Record<string, unknown>;
  render?: unknown;
};

type Identity = {
  id: string;
};

type UserMenuPin = {
  resource_name: string;
  position: number;
};

const getMenuPinsStorageKey = (userId: string) => `mcurio:menu-pins:${userId}`;

const isPinnable = (resourceName: string) =>
  resourceName !== "dashboard" && resourceName !== "logout";

export const Sider = ({ Title }: SiderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity<Identity>();

  // Get dynamic resources from Refine context
  const { resources: resourceDefinitions } = useResource();

  // Trial status for countdown
  const { trialStatus, loading: trialLoading } = useTrialStatus();

  const [pinnedItems, setPinnedItems] = React.useState<string[]>([]);
  const [pinsLoaded, setPinsLoaded] = React.useState(false);

  const menuResources = React.useMemo(
    () =>
      resourceDefinitions.filter(
        (resource: any) => typeof resource.list === "string" && resource.list,
      ),
    [resourceDefinitions],
  );

  const dashboardResource = React.useMemo(
    () => menuResources.find((resource: any) => resource.name === "dashboard"),
    [menuResources],
  );

  const otherResources = React.useMemo(
    () =>
      menuResources.filter((resource: any) => resource.name !== "dashboard"),
    [menuResources],
  );

  const pinnedResources = otherResources.filter((resource: any) =>
    pinnedItems.includes(resource.name),
  );

  const unpinnedResources = otherResources.filter(
    (resource: any) => !pinnedItems.includes(resource.name),
  );

  const orderedResources = [
    ...(dashboardResource ? [dashboardResource] : []),
    ...pinnedResources,
    ...unpinnedResources,
  ];

  React.useEffect(() => {
    const loadPins = async () => {
      setPinsLoaded(false);

      if (!identity?.id) {
        setPinnedItems([]);
        setPinsLoaded(true);
        return;
      }

      const storageKey = getMenuPinsStorageKey(identity.id);
      const cachedPins = localStorage.getItem(storageKey);

      if (cachedPins) {
        try {
          const parsedPins = JSON.parse(cachedPins) as string[];
          setPinnedItems(
            parsedPins.filter((resourceName) =>
              otherResources.some(
                (resource: any) => resource.name === resourceName,
              ),
            ),
          );
        } catch {
          localStorage.removeItem(storageKey);
        }
      }

      const { data, error } = await supabase
        .from("user_menu_pins")
        .select("resource_name, position")
        .eq("user_id", identity.id)
        .order("position", { ascending: true });

      if (error) {
        console.error("Failed to load menu pins", error);
        setPinsLoaded(true);
        return;
      }

      const loadedPins = ((data ?? []) as UserMenuPin[])
        .map((item) => item.resource_name)
        .filter((resourceName) =>
          otherResources.some(
            (resource: any) => resource.name === resourceName,
          ),
        );

      setPinnedItems(loadedPins);
      localStorage.setItem(storageKey, JSON.stringify(loadedPins));
      setPinsLoaded(true);
    };

    void loadPins();
  }, [identity?.id, otherResources]);

  React.useEffect(() => {
    const persistPins = async () => {
      if (!identity?.id || !pinsLoaded) {
        return;
      }

      localStorage.setItem(
        getMenuPinsStorageKey(identity.id),
        JSON.stringify(pinnedItems),
      );

      const { error: deleteError } = await supabase
        .from("user_menu_pins")
        .delete()
        .eq("user_id", identity.id);

      if (deleteError) {
        console.error("Failed to clear menu pins", deleteError);
        return;
      }

      if (pinnedItems.length === 0) {
        return;
      }

      const rows = pinnedItems.map((resourceName, index) => ({
        user_id: identity.id,
        resource_name: resourceName,
        position: index,
      }));

      const { error: insertError } = await supabase
        .from("user_menu_pins")
        .insert(rows);

      if (insertError) {
        console.error("Failed to save menu pins", insertError);
      }
    };

    void persistPins();
  }, [identity?.id, pinnedItems, pinsLoaded]);

  const selectedKey =
    orderedResources.find((resource) => {
      const listPath = resource.list as string;

      return (
        location.pathname === listPath ||
        location.pathname.startsWith(`${listPath}/`)
      );
    })?.name ?? "dashboard";

  const togglePin = (resourceName: string) => {
    setPinnedItems((currentItems) =>
      currentItems.includes(resourceName)
        ? currentItems.filter((item) => item !== resourceName)
        : [...currentItems, resourceName],
    );
  };

  return (
    <Layout.Sider
      width={260}
      className="mcurio-custom-sider"
      style={{
        background: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div className="mcurio-custom-sider__title">
        {Title ? <Title collapsed={false} /> : null}
      </div>

      {/* Trial Countdown */}
      {!trialLoading &&
        trialStatus &&
        (trialStatus.isOnTrial || trialStatus.isExpired) && (
          <div
            style={{ padding: "8px 16px", borderBottom: "1px solid #f0f0f0" }}
          >
            {trialStatus.isExpired ? (
              <Tag color="red" style={{ width: "100%", textAlign: "center" }}>
                Trial Expired
              </Tag>
            ) : trialStatus.isNearExpiration ? (
              <Tag
                color={trialStatus.daysRemaining <= 1 ? "red" : "orange"}
                style={{ width: "100%", textAlign: "center" }}
              >
                {trialStatus.daysRemaining} day
                {trialStatus.daysRemaining === 1 ? "" : "s"} left
              </Tag>
            ) : (
              <Tag color="blue" style={{ width: "100%", textAlign: "center" }}>
                {trialStatus.daysRemaining} day
                {trialStatus.daysRemaining === 1 ? "" : "s"} left
              </Tag>
            )}
          </div>
        )}

      <div className="mcurio-custom-sider__body">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          className="mcurio-custom-sider__menu"
          items={orderedResources.map((resource) => ({
            key: resource.name,
            icon: resource.meta?.icon,
            label: (
              <div className="mcurio-custom-sider__item">
                <span className="mcurio-custom-sider__label">
                  {resource.meta?.label ?? resource.name}
                </span>
                {isPinnable(resource.name) ? (
                  <Button
                    type="text"
                    size="small"
                    className="mcurio-custom-sider__pin"
                    icon={
                      pinnedItems.includes(resource.name) ? (
                        <PushpinFilled />
                      ) : (
                        <PushpinOutlined />
                      )
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      togglePin(resource.name);
                    }}
                  />
                ) : null}
              </div>
            ),
          }))}
          onClick={({ key }) => {
            const selectedResource = orderedResources.find(
              (resource) => resource.name === String(key),
            );

            if (selectedResource?.list) {
              navigate(selectedResource.list as string);
            }
          }}
        />

        <div className="mcurio-custom-sider__footer">
          <Divider style={{ margin: "8px 0 16px" }} />
          <Button
            type="text"
            block
            icon={<LogoutOutlined />}
            className="mcurio-custom-sider__logout"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </div>
    </Layout.Sider>
  );
};
