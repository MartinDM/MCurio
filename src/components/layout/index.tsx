import React from "react";
import { ThemedLayoutV2 } from "@refinedev/antd";
import { Header } from "./header";
import { Footer } from "./footer";
import { Sider } from "./sider";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="mcurio-app-shell">
      <ThemedLayoutV2
        Header={Header}
        Sider={Sider}
        Title={() => {
          return (
            <div style={{ padding: "10px 0" }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>MCurio</div>
              <div style={{ fontSize: 12, opacity: 0.72 }}>Museum CMS</div>
            </div>
          );
        }}
      >
        <div className="mcurio-page-frame">
          <div className="mcurio-app-content">{children}</div>
          <Footer />
        </div>
      </ThemedLayoutV2>
    </div>
  );
};
