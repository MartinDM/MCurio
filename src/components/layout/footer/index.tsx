import { theme } from "antd";

const { useToken } = theme;

export const Footer = () => {
  const { token } = useToken();

  return (
    <footer className="mcurio-footer" style={{ color: token.colorText }}>
      <div className="mcurio-footer-grid" style={{ marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 24, fontStyle: "italic" }}>MCurio</p>
          <p className="mcurio-subtle" style={{ maxWidth: 420, marginTop: 12 }}>
            Designed for curators, by historians. Our platform honors the legacy
            of institutional knowledge through high-performance digital tools.
          </p>
        </div>
        <div>
          <p
            style={{
              marginTop: 0,
              marginBottom: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Platform
          </p>
          <p className="mcurio-subtle" style={{ margin: "6px 0" }}>
            CMS Engine
          </p>
          <p className="mcurio-subtle" style={{ margin: "6px 0" }}>
            Spatial Planning
          </p>
          <p className="mcurio-subtle" style={{ margin: "6px 0" }}>
            Restoration Logs
          </p>
        </div>
        <div>
          <p
            style={{
              marginTop: 0,
              marginBottom: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Company
          </p>
          <p className="mcurio-subtle" style={{ margin: "6px 0" }}>
            Our Philosophy
          </p>
          <p className="mcurio-subtle" style={{ margin: "6px 0" }}>
            Ethics &amp; Provenance
          </p>
          <p className="mcurio-subtle" style={{ margin: "6px 0" }}>
            Press Room
          </p>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid #dfe4e0",
          paddingTop: 16,
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <p className="mcurio-subtle" style={{ margin: 0, fontSize: 12 }}>
          © 2024 MCurio Institutional Systems. All Rights Reserved.
        </p>
        <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
          <span className="mcurio-subtle">Privacy</span>
          <span className="mcurio-subtle">Security</span>
          <span className="mcurio-subtle">System Integrity</span>
        </div>
      </div>
    </footer>
  );
};
