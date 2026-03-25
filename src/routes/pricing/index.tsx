import { Button, Card, Form, Input } from "antd";
import { Link } from "react-router";

import { Footer } from "@/components/layout/footer";

export const PricingPage = () => {
  return (
    <div className="mcurio-landing">
      <nav className="mcurio-landing-nav">
        <div className="mcurio-landing-brand">
          <span className="material-symbols-outlined">account_balance</span>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, fontStyle: "italic" }}>
              MCurio
            </div>
            <div
              className="mcurio-subtle"
              style={{ fontSize: 12, letterSpacing: "0.18em" }}
            >
              MUSEUM CMS
            </div>
          </div>
        </div>

        <div className="mcurio-landing-nav-cta">
          <Link to="/">
            <Button>Home</Button>
          </Link>
          <Link to="/login" className="mcurio-landing-login-link">
            Login
          </Link>
        </div>
      </nav>

      <main className="mcurio-landing-main" style={{ maxWidth: 960 }}>
        <section style={{ textAlign: "center", marginBottom: 40 }}>
          <p
            style={{
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: 12,
              color: "#735c28",
              fontWeight: 700,
            }}
          >
            Pricing
          </p>
          <h1
            style={{
              margin: "10px 0",
              fontFamily: '"Noto Serif", serif',
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
            }}
          >
            One Plan for Institutions
          </h1>
          <p
            className="mcurio-subtle"
            style={{ maxWidth: 660, margin: "0 auto" }}
          >
            A single-tier package built for museum teams that need inventory
            oversight, exhibition coordination, and trusted industry contact
            management.
          </p>
        </section>

        <Card
          style={{
            borderRadius: 10,
            borderColor: "#dee4e0",
            marginBottom: 30,
            boxShadow: "0 12px 30px rgba(45, 52, 50, 0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontFamily: '"Noto Serif", serif',
              fontSize: 30,
            }}
          >
            MCurio Institutional
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 38, fontWeight: 700, color: "#5d5e61" }}>
              £X
            </span>
            <span className="mcurio-subtle">/ month</span>
          </div>
          <p className="mcurio-subtle" style={{ marginTop: 0 }}>
            Single-tier access for your full curatorial and operations team.
          </p>

          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              lineHeight: 1.8,
              color: "#2d3432",
            }}
          >
            <li>Intuitive inventory and condition management</li>
            <li>Exhibition planning and movement tracking</li>
            <li>Industry contact directory and collaboration tools</li>
            <li>Audit-friendly reporting across modules</li>
          </ul>
        </Card>

        <section
          style={{
            background: "#f2f4f2",
            border: "1px solid #dee4e0",
            borderRadius: 10,
            padding: 24,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              fontFamily: '"Noto Serif", serif',
              fontSize: 26,
            }}
          >
            Request Access
          </h3>
          <p className="mcurio-subtle" style={{ marginTop: 0 }}>
            Tell us a little about your institution and we will contact you with
            onboarding details.
          </p>

          <Form
            layout="vertical"
            action="mailto:support@mcurio.com"
            method="post"
            encType="text/plain"
          >
            <Form.Item label="Name" required>
              <Input name="name" placeholder="Your name" required />
            </Form.Item>
            <Form.Item label="Email" required>
              <Input
                name="email"
                type="email"
                placeholder="you@museum.org"
                required
              />
            </Form.Item>
            <Form.Item label="Museum / Institution" required>
              <Input
                name="institution"
                placeholder="Institution name"
                required
              />
            </Form.Item>
            <Form.Item label="Message" required>
              <Input.TextArea
                name="message"
                rows={4}
                placeholder="Share your current setup and team size"
                required
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="mcurio-landing-primary-btn"
            >
              Request Access
            </Button>
          </Form>
        </section>
      </main>

      <Footer />
    </div>
  );
};
