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
          <a href="#contacts">Contacts</a>
          <a href="#exhibitions">Exhibitions</a>
          <a href="#access">Access</a>
        </div>

        <div className="mcurio-landing-nav-cta">
          <Link to="/login" className="mcurio-landing-login-link">
            Login
          </Link>
          <Link to="/pricing">
            <Button
              type="primary"
              className="mcurio-landing-btn mcurio-landing-btn--nav-primary"
            >
              View Pricing
            </Button>
          </Link>
        </div>
      </nav>

      <main className="mcurio-landing-main">
        <section className="mcurio-landing-hero">
          <div className="mcurio-landing-hero-copy">
            <p className="mcurio-landing-eyebrow">Your curation hub</p>
            <h1 className="mcurio-landing-title">
              From objects to exhibitions <i>in one place</i>
            </h1>
            <p className="mcurio-subtle mcurio-landing-description">
              MCurio is an archival system designed for modern institutions who
              want flexibility and rich tagging and grouping of their inventory.
              Manage provenance, create a story for each piece, and curate
              exhibitions.
            </p>
            <Link to="/pricing">
              <Button
                type="primary"
                size="large"
                className="mcurio-landing-btn mcurio-landing-btn--primary"
              >
                Get Started Free
              </Button>
            </Link>
          </div>

          <div className="mcurio-landing-hero-visual">
            <div className="mcurio-landing-hero-image-wrap">
              <img src="landing.jpg" alt="Modern gallery space" />
              <article className="mcurio-landing-hero-card">
                <div className="mcurio-landing-hero-card-top">
                  <span className="material-symbols-outlined">verified</span>
                  <span>Artifact ID: ARC-992</span>
                </div>
                <p>Oil on canvas</p>
                <div className="mcurio-landing-hero-card-meta">
                  <span>Condition: Pristine</span>
                  <span>On loan from: Regional gallery</span>
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
            <span className="material-symbols-outlined mcurio-landing-card-icon">
              inventory_2
            </span>
            <h3>Inventory</h3>
            <p className="mcurio-subtle">
              Manage high-density metadata with editorial precision, condition
              reporting, and provenance tracking in one clear workspace. Prepare
              exhibition content per item with markdown and export it when
              creating your physical exhibition.
            </p>
          </article>

          <article className="mcurio-landing-card" id="contacts">
            <span className="material-symbols-outlined mcurio-landing-card-icon">
              contacts
            </span>
            <h3>Industry Contacts</h3>
            <p className="mcurio-subtle">
              Coordinate curators, lenders, and partners with a shared directory
              built for museum operations.
            </p>
          </article>

          <article className="mcurio-landing-card" id="exhibitions">
            <span className="material-symbols-outlined mcurio-landing-card-icon">
              museum
            </span>
            <h3>Exhibitions</h3>
            <p className="mcurio-subtle">
              Plan and organise exhibitions end-to-end — from object selection
              and layout to scheduling and public-facing details.
            </p>
          </article>

          <article className="mcurio-landing-card" id="access">
            <span className="material-symbols-outlined mcurio-landing-card-icon">
              manage_accounts
            </span>
            <h3>Access &amp; Roles</h3>
            <p className="mcurio-subtle">
              Define granular permissions across your institution so the right
              people have the right level of access to collections data.
            </p>
          </article>

          <article className="mcurio-landing-card">
            <span className="material-symbols-outlined mcurio-landing-card-icon">
              label
            </span>
            <h3>Meta Tagging</h3>
            <p className="mcurio-subtle">
              Enrich records with structured tags — medium, period, culture,
              subject — to power search, filtering, and future discovery.
            </p>
          </article>

          <article className="mcurio-landing-card">
            <span className="material-symbols-outlined mcurio-landing-card-icon">
              fact_check
            </span>
            <h3>Inspection Reports</h3>
            <p className="mcurio-subtle">
              Log condition assessments and flag issues at any point in an
              object's lifecycle, from acquisition through to loan and return.
            </p>
          </article>
        </section>

        <section className="mcurio-landing-final-cta">
          <h2>Elevate your archive to the editorial standard it deserves.</h2>
          <p>
            Join forward-thinking institutions defining the future of digital
            preservation. Start a trial, and let us know how we can support your
            collection's unique needs.
          </p>
          <Link to="/pricing">
            <Button
              type="primary"
              size="large"
              className="mcurio-landing-btn mcurio-landing-btn--primary"
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
        <a href="#contacts">
          <span className="material-symbols-outlined">contacts</span>
          <span>Contacts</span>
        </a>
        <a href="#exhibitions">
          <span className="material-symbols-outlined">museum</span>
          <span>Exhibitions</span>
        </a>
        <Link to="/pricing">
          <span className="material-symbols-outlined">sell</span>
          <span>Pricing</span>
        </Link>
      </nav>
    </div>
  );
};
