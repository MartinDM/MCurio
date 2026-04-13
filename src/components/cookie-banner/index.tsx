import { useEffect, useState } from "react";

import { Button } from "antd";
import { Link } from "react-router";

const COOKIE_PREFERENCE_KEY = "mcurio:cookie-preference";
const LOGIN_CREDENTIALS_KEY = "mcurio:login-credentials";

type CookiePreference = "all" | "necessary";

const isCookiePreference = (value: string | null): value is CookiePreference =>
  value === "all" || value === "necessary";

export const CookieBanner = () => {
  const [preference, setPreference] = useState<CookiePreference | null>(null);

  useEffect(() => {
    const storedPreference = localStorage.getItem(COOKIE_PREFERENCE_KEY);
    if (isCookiePreference(storedPreference)) {
      setPreference(storedPreference);
    }
  }, []);

  const savePreference = (value: CookiePreference) => {
    localStorage.setItem(COOKIE_PREFERENCE_KEY, value);

    if (value === "necessary") {
      localStorage.removeItem(LOGIN_CREDENTIALS_KEY);
    }

    setPreference(value);
  };

  if (preference) {
    return null;
  }

  return (
    <aside
      className="mcurio-cookie-banner"
      aria-label="Cookie preferences"
      role="dialog"
      aria-live="polite"
    >
      <div className="mcurio-cookie-banner__copy">
        <p className="mcurio-cookie-banner__eyebrow">Cookie notice</p>
        <h2 className="mcurio-cookie-banner__title">
          Your preferences, simply handled
        </h2>
        <p className="mcurio-cookie-banner__text">
          MCurio uses essential cookies and local storage to keep sign-in and
          core site functions working. You can allow optional storage for saved
          preferences too. Read more in our{" "}
          <Link to="/privacy">Privacy page</Link>.
        </p>
      </div>

      <div className="mcurio-cookie-banner__actions">
        <Button
          onClick={() => savePreference("necessary")}
          className="mcurio-landing-btn mcurio-landing-btn--secondary"
        >
          Only necessary
        </Button>
        <Button
          type="primary"
          className="mcurio-landing-btn mcurio-landing-btn--primary"
          onClick={() => savePreference("all")}
        >
          Accept all
        </Button>
      </div>
    </aside>
  );
};
