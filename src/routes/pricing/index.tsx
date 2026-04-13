import { Button, Card, Col, Row, Typography, Switch } from "antd";
import { Link } from "react-router";
import { CheckOutlined, StarOutlined } from "@ant-design/icons";
import { useState } from "react";

import { Footer } from "@/components/layout/footer";

const { Title, Text } = Typography;

export const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const personalPrice = isAnnual ? 14 * 11 : 14;
  const museumPrice = isAnnual ? 55 * 11 : 55;
  const museumPricePerMonth = isAnnual ? Math.round((55 * 11) / 12) : 55;

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

      <main className="mcurio-landing-main" style={{ maxWidth: 1200 }}>
        <section style={{ textAlign: "center", marginBottom: 60 }}>
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
            Choose Your Plan
          </h1>
          <p
            className="mcurio-subtle"
            style={{ maxWidth: 660, margin: "0 auto" }}
          >
            Whether you're managing a personal collection or running a museum,
            MCurio adapts to your needs. Start free and grow as you expand.
          </p>

          {/* Billing Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              margin: "32px 0",
              padding: "16px 24px",
              backgroundColor: "#f9fafa",
              borderRadius: 12,
              maxWidth: 400,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Text
              style={{
                color: isAnnual ? "#8c8c8c" : "#1890ff",
                fontWeight: isAnnual ? 400 : 600,
              }}
            >
              Monthly
            </Text>
            <Switch
              checked={isAnnual}
              onChange={setIsAnnual}
              style={{
                backgroundColor: isAnnual ? "#1890ff" : "#00000040",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text
                style={{
                  color: isAnnual ? "#1890ff" : "#8c8c8c",
                  fontWeight: isAnnual ? 600 : 400,
                }}
              >
                Annual
              </Text>
              {isAnnual && (
                <span
                  style={{
                    backgroundColor: "#52c41a",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Save 1 month
                </span>
              )}
            </div>
          </div>
        </section>

        <Row gutter={[32, 32]} justify="center">
          {/* Personal Tier */}
          <Col xs={24} md={12} lg={10}>
            <Card
              style={{
                borderRadius: 12,
                borderColor: "#dee4e0",
                height: "100%",
                boxShadow: "0 8px 24px rgba(45, 52, 50, 0.06)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Title
                  level={3}
                  style={{ marginBottom: 8, fontFamily: '"Noto Serif", serif' }}
                >
                  Personal
                </Title>
                <Text type="secondary">For individual collectors</Text>
              </div>

              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 24, fontWeight: 700, color: "#5d5e61" }}
                  >
                    £
                  </span>
                  <span
                    style={{ fontSize: 42, fontWeight: 700, color: "#5d5e61" }}
                  >
                    {isAnnual ? Math.round(personalPrice / 12) : personalPrice}
                  </span>
                  <span
                    style={{ fontSize: 24, fontWeight: 500, color: "#8c8c8c" }}
                  >
                    /month
                  </span>
                </div>
                <Text type="secondary">
                  {isAnnual
                    ? `£${personalPrice} billed annually • Up to 2 users`
                    : "7-day free trial • Up to 2 users included"}
                </Text>
              </div>

              <div style={{ marginBottom: 32 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    "Up to 2 users included",
                    "Additional users: £7/month each",
                    "Up to 20 items during trial",
                    "Basic condition tracking",
                    "Contact management",
                    "Location management",
                    "Export your data anytime",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 12,
                        fontSize: 14,
                        color: "#2d3432",
                        fontStyle: index === 1 ? "italic" : "normal",
                      }}
                    >
                      <CheckOutlined
                        style={{ color: "#52c41a", marginRight: 12 }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                    fontStyle: "italic",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  * After trial: Unlimited items in your collection
                </Text>
              </div>

              <Link to="/onboarding?plan=personal" style={{ width: "100%" }}>
                <Button
                  size="large"
                  block
                  style={{
                    borderRadius: 8,
                    height: 48,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Start Collecting
                </Button>
              </Link>
            </Card>
          </Col>

          {/* Museum Tier */}
          <Col xs={24} md={12} lg={10}>
            <Card
              style={{
                borderRadius: 12,
                borderColor: "#1890ff",
                borderWidth: 2,
                height: "100%",
                boxShadow: "0 12px 32px rgba(24, 144, 255, 0.15)",
                position: "relative",
                overflow: "visible",
              }}
            >
              {/* Popular badge */}
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#1890ff",
                  color: "white",
                  padding: "6px 20px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <StarOutlined /> MOST POPULAR
              </div>

              <div
                style={{ textAlign: "center", marginBottom: 24, marginTop: 12 }}
              >
                <Title
                  level={3}
                  style={{ marginBottom: 8, fontFamily: '"Noto Serif", serif' }}
                >
                  Museum
                </Title>
                <Text type="secondary">For institutions & organizations</Text>
              </div>

              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 24, fontWeight: 700, color: "#1890ff" }}
                  >
                    £
                  </span>
                  <span
                    style={{ fontSize: 42, fontWeight: 700, color: "#1890ff" }}
                  >
                    {museumPricePerMonth}
                  </span>
                  <span
                    style={{ fontSize: 24, fontWeight: 500, color: "#8c8c8c" }}
                  >
                    /month
                  </span>
                </div>
                <Text type="secondary">
                  {isAnnual
                    ? `£${museumPrice} billed annually • Up to 3 users`
                    : "7-day free trial • Up to 3 users included"}
                </Text>
              </div>

              <div style={{ marginBottom: 32 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    "Everything in Personal, plus:",
                    "Up to 3 users included",
                    "Additional users: £7/month each",
                    "Up to 50 items during trial",
                    "Multi-user collaboration",
                    "Professional exhibition management",
                    "Loan management & agreements",
                    "Advanced condition reporting",
                    "Institutional reporting",
                    "Priority support",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 12,
                        fontSize: 14,
                        color: "#2d3432",
                        fontWeight: index === 0 ? 600 : 400,
                        fontStyle: index === 2 ? "italic" : "normal",
                      }}
                    >
                      <CheckOutlined
                        style={{
                          color: index === 0 ? "#1890ff" : "#52c41a",
                          marginRight: 12,
                        }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                    fontStyle: "italic",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  * After trial: Unlimited items in your collection
                </Text>
              </div>

              <Link to="/onboarding?plan=museum" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  style={{
                    borderRadius: 8,
                    height: 48,
                    fontSize: 16,
                    fontWeight: 500,
                    background: "#1890ff",
                  }}
                >
                  Start Your Museum
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>

        <section
          style={{
            textAlign: "center",
            marginTop: 80,
            marginBottom: 40,
            padding: 40,
            background: "#f9fafa",
            borderRadius: 12,
          }}
        >
          <Title
            level={4}
            style={{ fontFamily: '"Noto Serif", serif', marginBottom: 16 }}
          >
            Questions about pricing?
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: 16, display: "block", marginBottom: 24 }}
          >
            We're here to help you choose the right plan for your needs.
          </Text>
          <Button size="large" style={{ marginRight: 16 }}>
            Contact Sales
          </Button>
          <Link to="/login">
            <Button type="link" size="large">
              Already have an account? Sign in
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};
