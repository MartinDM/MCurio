import { useGetIdentity } from "@refinedev/core";

import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Spin } from "antd";

import { getNameInitials } from "@/utilities";

import { CustomAvatar } from "../../custom-avatar";
import { Text } from "../../text";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
};

export const AccountSettings = ({ opened, setOpened, userId }: Props) => {
  const { data: user, isLoading } = useGetIdentity<{
    id: string;
    name?: string;
    avatar?: string;
  }>();

  const closeModal = () => {
    setOpened(false);
  };

  if (isLoading) {
    return (
      <Drawer
        open={opened}
        width={756}
        styles={{
          body: {
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Spin />
      </Drawer>
    );
  }

  return (
    <Drawer
      onClose={closeModal}
      open={opened}
      width={756}
      styles={{
        body: { background: "#f5f5f5", padding: 0 },
        header: { display: "none" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Text strong>Account Settings</Text>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => closeModal()}
        />
      </div>
      <div
        style={{
          padding: "16px",
        }}
      >
        <Card>
          <CustomAvatar
            shape="square"
            src={user?.avatar}
            name={getNameInitials(user?.name || "")}
            style={{
              width: 96,
              height: 96,
              marginBottom: "24px",
            }}
          />
          <Text strong>User ID</Text>
          <Text style={{ display: "block", marginBottom: "12px" }}>
            {userId}
          </Text>
          <Text strong>Name / Email</Text>
          <Text style={{ display: "block", marginBottom: "12px" }}>
            {user?.name ?? "Unknown user"}
          </Text>
        </Card>
      </div>
    </Drawer>
  );
};
