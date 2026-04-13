import { Button } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { Footer } from "@/components/layout/footer";

type PageSection = {
  title: string;
  body: ReactNode;
};

type PublicContentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PageSection[];
};

const PublicContentPage = ({
  eyebrow,
  title,
  intro,
  sections,
}: PublicContentPageProps) => {
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
          <Link to="/pricing">
            <Button
              type="primary"
              className="mcurio-landing-btn mcurio-landing-btn--nav-primary"
            >
              Request Access
            </Button>
          </Link>
        </div>
      </nav>

      <main className="mcurio-landing-main" style={{ maxWidth: 960 }}>
        <section className="mcurio-content-page-hero">
          <p className="mcurio-landing-eyebrow">{eyebrow}</p>
          <h1 className="mcurio-content-page-title">{title}</h1>
          <p className="mcurio-subtle mcurio-content-page-intro">{intro}</p>
        </section>

        <section className="mcurio-content-page-grid">
          {sections.map((section) => (
            <article key={section.title} className="mcurio-content-page-card">
              <h2>{section.title}</h2>
              <div className="mcurio-subtle">{section.body}</div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export const CmsEnginePage = () => (
  <PublicContentPage
    eyebrow="Platform"
    title="CMS Engine"
    intro="A structured collections workspace built for institutions that need fast retrieval, editorial control, and dependable record history."
    sections={[
      {
        title: "Built for collection depth",
        body: (
          <p>
            MCurio&apos;s core CMS is designed for catalogues that carry rich
            provenance, condition, movement, lender, and exhibition context
            without becoming difficult to search or maintain.
          </p>
        ),
      },
      {
        title: "Editorial confidence",
        body: (
          <p>
            Curators and registrars can update records with clearer ownership,
            cleaner metadata standards, and a consistent audit trail across the
            object lifecycle.
          </p>
        ),
      },
      {
        title: "Operational continuity",
        body: (
          <p>
            The platform supports long-lived institutional knowledge, helping
            teams preserve context through staffing changes, loans, and future
            planning work.
          </p>
        ),
      },
    ]}
  />
);

export const SpatialPlanningPage = () => (
  <PublicContentPage
    eyebrow="Platform"
    title="Spatial Planning"
    intro="Plan rooms, object movements, and exhibition layouts in a way that keeps practical logistics connected to curatorial decisions."
    sections={[
      {
        title: "Exhibition coordination",
        body: (
          <p>
            Track where works are intended to sit, how they relate to one
            another, and which stakeholders need to approve or action movement
            before installation windows begin.
          </p>
        ),
      },
      {
        title: "Clearer handovers",
        body: (
          <p>
            Layout planning becomes easier to share across curatorial,
            operations, and technical teams when placement notes live alongside
            the records they depend on.
          </p>
        ),
      },
      {
        title: "Fewer surprises onsite",
        body: (
          <p>
            By tying planning data to objects, condition notes, and scheduling,
            institutions can reduce last-minute ambiguity during installs and
            gallery reconfiguration.
          </p>
        ),
      },
    ]}
  />
);

export const RestorationLogsPage = () => (
  <PublicContentPage
    eyebrow="Platform"
    title="Restoration Logs"
    intro="Document treatment history and conservation observations in a format that is legible to today’s team and still useful years later."
    sections={[
      {
        title: "Treatment records",
        body: (
          <p>
            Keep restoration actions, dates, contributors, and outcomes tied to
            the object record so condition context does not drift into separate
            documents.
          </p>
        ),
      },
      {
        title: "Conservation continuity",
        body: (
          <p>
            Future conservators can review earlier interventions with clearer
            context, helping institutions make decisions that respect both
            object safety and institutional memory.
          </p>
        ),
      },
      {
        title: "Audit-ready documentation",
        body: (
          <p>
            Logs can support governance, insurance, and lender requirements by
            presenting a more complete view of object care over time.
          </p>
        ),
      },
    ]}
  />
);

export const PhilosophyPage = () => (
  <PublicContentPage
    eyebrow="Company"
    title="Our Philosophy"
    intro="MCurio is designed around the idea that collections software should strengthen scholarship and operations rather than force teams into generic workflows."
    sections={[
      {
        title: "Historian-led design",
        body: (
          <p>
            We value traceability, source context, and the texture of
            institutional knowledge. Tools should help people preserve nuance,
            not flatten it.
          </p>
        ),
      },
      {
        title: "Quietly capable software",
        body: (
          <p>
            The best systems reduce friction in daily work. We focus on speed,
            structure, and dependable interfaces that make serious records work
            feel calmer.
          </p>
        ),
      },
      {
        title: "Stewardship over hype",
        body: (
          <p>
            Museums and cultural institutions need software that respects long
            timelines, responsible access, and the obligations that come with
            custodianship.
          </p>
        ),
      },
    ]}
  />
);

export const EthicsAndProvenancePage = () => (
  <PublicContentPage
    eyebrow="Company"
    title="Ethics & Provenance"
    intro="Responsible collections management depends on clear provenance records, accountable review, and systems that make sensitive context easier to preserve."
    sections={[
      {
        title: "Provenance as working data",
        body: (
          <p>
            We encourage institutions to treat provenance information as active
            operational knowledge rather than static narrative, especially where
            acquisition history is incomplete or contested.
          </p>
        ),
      },
      {
        title: "Support for responsible review",
        body: (
          <p>
            MCurio aims to help teams organise the evidence, notes, and status
            markers needed for ethical review, due diligence, and collaboration
            with internal and external stakeholders.
          </p>
        ),
      },
      {
        title: "Institution-first governance",
        body: (
          <p>
            Each institution remains responsible for its own legal and ethical
            decisions. Our role is to provide infrastructure that supports
            clearer stewardship and better-informed action.
          </p>
        ),
      },
    ]}
  />
);

export const PressRoomPage = () => (
  <PublicContentPage
    eyebrow="Company"
    title="Press Room"
    intro="A short overview for partners, journalists, and institutions seeking background on the MCurio platform and its intended use."
    sections={[
      {
        title: "About MCurio",
        body: (
          <p>
            MCurio is a collections and exhibition management platform built for
            museums and heritage organisations that need stronger structure
            across inventory, contacts, condition, and planning.
          </p>
        ),
      },
      {
        title: "Who it serves",
        body: (
          <p>
            The product is intended for curatorial, registration, operations,
            and collections teams working across small specialist collections to
            larger institutional archives.
          </p>
        ),
      },
      {
        title: "Press enquiries",
        body: (
          <p>
            For product background, interviews, or institutional partnership
            enquiries, please contact support@mcurio.com and include your
            publication or organisation details.
          </p>
        ),
      },
    ]}
  />
);

export const PrivacyPage = () => (
  <PublicContentPage
    eyebrow="Legal"
    title="Privacy"
    intro="This page summarises how MCurio approaches personal data handling for institutional customers, prospective customers, and visitors to public-facing pages."
    sections={[
      {
        title: "Information we collect",
        body: (
          <p>
            We may collect contact details, organisation details, account access
            information, and product usage information where needed to provide
            and support the service.
          </p>
        ),
      },
      {
        title: "How we use it",
        body: (
          <p>
            Personal data may be used to authenticate users, maintain service
            security, respond to enquiries, onboard customers, and improve the
            reliability of the platform.
          </p>
        ),
      },
      {
        title: "Data rights",
        body: (
          <p>
            Where UK data protection law applies, individuals may have rights to
            access, correct, erase, restrict, or object to certain processing.
            Requests can be sent to support@mcurio.com.
          </p>
        ),
      },
    ]}
  />
);

export const SecurityPage = () => (
  <PublicContentPage
    eyebrow="Legal"
    title="Security"
    intro="MCurio is built with a focus on operational reliability, controlled access, and the protection of institutional records."
    sections={[
      {
        title: "Access controls",
        body: (
          <p>
            We support role-based access patterns so institutions can align user
            permissions with operational responsibilities and reduce unnecessary
            exposure to sensitive records.
          </p>
        ),
      },
      {
        title: "Service safeguards",
        body: (
          <p>
            Reasonable technical and organisational measures are used to protect
            the platform and associated customer data against unauthorised
            access, misuse, and loss.
          </p>
        ),
      },
      {
        title: "Shared responsibility",
        body: (
          <p>
            Effective security also depends on customers managing user access,
            account hygiene, and internal governance in line with their own risk
            profile and policies.
          </p>
        ),
      },
    ]}
  />
);

export const TermsPage = () => (
  <PublicContentPage
    eyebrow="Legal"
    title="Terms of Service"
    intro="These Terms of Service set out the basis on which MCurio Institutional Systems makes the MCurio platform available to business and institutional customers in the United Kingdom."
    sections={[
      {
        title: "1. Contract basis",
        body: (
          <p>
            By accessing or using MCurio on behalf of a museum, gallery,
            university, charity, or other organisation, you confirm that you are
            authorised to bind that organisation to these terms. If you are
            using the service as a consumer, your statutory rights are not
            affected.
          </p>
        ),
      },
      {
        title: "2. Service use",
        body: (
          <p>
            You must use the platform only for lawful purposes and in a manner
            consistent with these terms, your organisation&apos;s policies, and
            any applicable professional or regulatory duties. You must not
            attempt to interfere with the service, gain unauthorised access, or
            upload material you do not have the right to use.
          </p>
        ),
      },
      {
        title: "3. Customer data",
        body: (
          <p>
            Your organisation retains responsibility for the accuracy,
            lawfulness, and provenance of the data it places in MCurio. Where
            personal data is processed, both parties will comply with applicable
            UK data protection law, including the UK GDPR and the Data
            Protection Act 2018 where relevant.
          </p>
        ),
      },
      {
        title: "4. Fees and suspension",
        body: (
          <p>
            Agreed subscription charges are payable in pounds sterling unless we
            agree otherwise in writing. We may suspend access on reasonable
            notice where charges remain overdue or where suspension is needed to
            protect the service, investigate misuse, or comply with legal
            obligations.
          </p>
        ),
      },
      {
        title: "5. Liability",
        body: (
          <p>
            Nothing in these terms limits or excludes liability where it would
            be unlawful to do so, including liability for fraud or for death or
            personal injury caused by negligence. Subject to that, the service
            is provided with reasonable care and skill, and any further
            liability will be limited to the fees paid by the customer in the 12
            months preceding the event giving rise to the claim.
          </p>
        ),
      },
      {
        title: "6. Governing law",
        body: (
          <p>
            These terms and any non-contractual disputes arising out of or in
            connection with them are governed by the laws of England and Wales.
            The courts of England and Wales will have exclusive jurisdiction,
            unless mandatory law provides otherwise.
          </p>
        ),
      },
    ]}
  />
);
