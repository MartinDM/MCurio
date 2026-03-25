import { Button, Card, Result, Typography } from "antd";
import { useGetIdentity, useNavigation } from "@refinedev/core";

type Identity = {
  id: string;
  name: string;
};

export const NoMuseumPage = () => {
  const { push } = useNavigation();
  const { data: user } = useGetIdentity<Identity>();

  const debugInfo = `
USER_ID: ${user?.id ?? "unknown"}
EMAIL:   ${user?.name ?? "unknown"}

MANUAL ASSIGNMENT (Supabase Studio):
1. Go to http://127.0.0.1:54323/
2. Open the SQL Editor
3. Step 1 — Create a museum (if none exists):

   INSERT INTO public.museums (name)
   VALUES ('Your Museum Name')
   RETURNING id;

4. Step 2 — Assign the museum to this user:

   UPDATE public.profiles
   SET museum_id = 'PASTE_MUSEUM_UUID_HERE'
   WHERE id = '${user?.id ?? "USER_UUID"}';

5. Refresh the app and log in again.

Need help? Contact: support@mcurio.com
`.trim();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Card style={{ maxWidth: 700, width: "100%" }}>
        <Result
          status="403"
          title="No Museum Access"
          subTitle="Your account is not yet associated with a museum."
        />
        <Typography.Paragraph>
          Follow the steps below to assign a museum, or contact MCurio support.
        </Typography.Paragraph>
        <textarea
          readOnly
          value={debugInfo}
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            width: "100%",
            height: "260px",
            padding: "12px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            marginTop: "8px",
            marginBottom: "16px",
            color: "#333",
            resize: "vertical",
          }}
        />
        <Button type="primary" onClick={() => push("/login")}>
          Back to Login
        </Button>
      </Card>
    </div>
  );
};
