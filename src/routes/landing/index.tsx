import { Button } from "antd";
import { Link } from "react-router";

import { Footer } from "@/components/layout/footer";

export const LandingPage = () => {
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

        <div className="mcurio-landing-nav-links">
          <a href="#inventory">Inventory</a>
          <a href="#exhibitions">Exhibitions</a>
          <a href="#contacts">Contacts</a>
        </div>

        <div className="mcurio-landing-nav-cta">
          <Link to="/login" className="mcurio-landing-login-link">
            Login
          </Link>
          <Link to="/pricing">
            <Button type="primary" className="mcurio-landing-nav-primary-btn">
              Request Access
            </Button>
          </Link>
        </div>
      </nav>

      <main className="mcurio-landing-main">
        <section className="mcurio-landing-hero">
          <div className="mcurio-landing-hero-copy">
            <p className="mcurio-landing-eyebrow">The Digital Curator Elite</p>
            <h1 className="mcurio-landing-title">
              Preserving History through <i>Modern Precision.</i>
            </h1>
            <p className="mcurio-subtle mcurio-landing-description">
              MCurio is a sophisticated archival ecosystem designed for modern
              institutions. Manage provenance, schedule exhibitions, and
              collaborate across departments with intuitive workflows.
            </p>
            <Link to="/pricing">
              <Button
                type="primary"
                size="large"
                className="mcurio-landing-primary-btn"
              >
                Request Access
              </Button>
            </Link>
          </div>

          <div className="mcurio-landing-hero-visual">
            <div className="mcurio-landing-hero-image-wrap">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANFGnUTgR5KOoS_94kiOYiEE2LAp3xaOmqIdQ6RyfevbWxaC_4B3-tPLS3nqB4qTm9-qxpPanSN6QtDN1nGoUNo5--CM62Mlk08X7IhqaB96UY8sny02IDbmS8Fv2a7ThXwTnB1MUcfWK2r2ifsX7SdqCdTHo8iWA8QZCB7sNZRcfHF13wQOOxvbwlmurcBqAIxqZUJUwGwy2hNGIQSZdgjh-aOrUxB2A0S7kFkvYSmqPF3zO-jePO-MqX3vd_Sh1kyVgKwkXTOUay"
                alt="Classical sculpture in a modern gallery space"
              />
              <article className="mcurio-landing-hero-card">
                <div className="mcurio-landing-hero-card-top">
                  <span className="material-symbols-outlined">verified</span>
                  <span>Artifact ID: ARC-992-B</span>
                </div>
                <p>Hellenistic Fragment</p>
                <div className="mcurio-landing-hero-card-meta">
                  <span>Condition: Pristine</span>
                  <span>Vault: Wing C</span>
                </div>
              </article>
            </div>
          </div>
          <div className="mcurio-landing-hero-accent" />
        </section>

        <section
          className="mcurio-landing-grid"
          aria-label="Core modules"
          id="inventory"
        >
          <article className="mcurio-landing-card">
            <p className="mcurio-subtle" style={{ margin: 0, fontSize: 12 }}>
              Module 01
            </p>
            <h3>Inventory</h3>
            <p className="mcurio-subtle">
              Manage high-density metadata with editorial precision, condition
              reporting, and provenance tracking in one clear workspace.
            </p>
          </article>

          <article className="mcurio-landing-card" id="contacts">
            <p className="mcurio-subtle" style={{ margin: 0, fontSize: 12 }}>
              Module 02
            </p>
            <h3>Industry Contacts</h3>
            <p className="mcurio-subtle">
              Coordinate curators, lenders, and partners with a shared directory
              built for museum operations.
            </p>
          </article>
        </section>

        <section className="mcurio-landing-stats" id="exhibitions">
          <div>
            <span>400+</span>
            <small>Institutions</small>
          </div>
          <div>
            <span>12M</span>
            <small>Artifacts Tracked</small>
          </div>
          <div>
            <span>99.9%</span>
            <small>Data Fidelity</small>
          </div>
          <div>
            <span>24/7</span>
            <small>Global Support</small>
          </div>
        </section>

        <section className="mcurio-landing-final-cta">
          <h2>Elevate your archive to the editorial standard it deserves.</h2>
          <p>
            Join forward-thinking institutions defining the future of digital
            preservation.
          </p>
          <Link to="/pricing">
            <Button
              type="primary"
              size="large"
              className="mcurio-landing-primary-btn"
            >
              Request Access
            </Button>
          </Link>
        </section>
      </main>

      <Footer />

      <nav className="mcurio-landing-mobile-nav">
        <a href="#inventory">
          <span className="material-symbols-outlined">inventory_2</span>
          <span>Inventory</span>
        </a>
        <a href="#exhibitions">
          <span className="material-symbols-outlined">event</span>
          <span>Exhibitions</span>
        </a>
        <a href="#contacts">
          <span className="material-symbols-outlined">contacts</span>
          <span>Contacts</span>
        </a>
        <Link to="/pricing">
          <span className="material-symbols-outlined">sell</span>
          <span>Pricing</span>
        </Link>
      </nav>
    </div>
  );
};
