import { theme } from "antd";
import { Link } from "react-router";

const { useToken } = theme;

export const Footer = () => {
  const { token } = useToken();

  const platformLinks = [
    { label: "CMS Engine", to: "/platform/cms-engine" },
    { label: "Spatial Planning", to: "/platform/spatial-planning" },
    { label: "Restoration Logs", to: "/platform/restoration-logs" },
  ];

  const companyLinks = [
    { label: "Our Philosophy", to: "/company/our-philosophy" },
    {
      label: "Ethics & Provenance",
      to: "/company/ethics-and-provenance",
    },
    { label: "Press Room", to: "/company/press-room" },
  ];

  const legalLinks = [
    { label: "Privacy", to: "/privacy" },
    { label: "Security", to: "/security" },
    { label: "Terms of Service", to: "/terms" },
  ];

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
          <div className="mcurio-footer-link-list">
            {platformLinks.map((link) => (
              <Link key={link.to} to={link.to} className="mcurio-footer-link">
                {link.label}
              </Link>
            ))}
          </div>
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
          <div className="mcurio-footer-link-list">
            {companyLinks.map((link) => (
              <Link key={link.to} to={link.to} className="mcurio-footer-link">
                {link.label}
              </Link>
            ))}
          </div>
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
        <div
          style={{ display: "flex", gap: 16, fontSize: 12, flexWrap: "wrap" }}
        >
          {legalLinks.map((link) => (
            <Link key={link.to} to={link.to} className="mcurio-footer-link">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
