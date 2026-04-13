import { FormEvent, useEffect, useState } from "react";

import { useLogin } from "@refinedev/core";
import { Button } from "antd";
import { useNavigate } from "react-router";

const COOKIE_PREFERENCE_KEY = "mcurio:cookie-preference";
const LOGIN_CREDENTIALS_KEY = "mcurio:login-credentials";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useLogin<{
    email: string;
    password: string;
  }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberCredentials, setRememberCredentials] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const cookiePreference = localStorage.getItem(COOKIE_PREFERENCE_KEY);

    if (cookiePreference !== "all") {
      localStorage.removeItem(LOGIN_CREDENTIALS_KEY);
      return;
    }

    const saved = localStorage.getItem(LOGIN_CREDENTIALS_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { email?: string; password?: string };
      setEmail(parsed.email ?? "");
      setPassword(parsed.password ?? "");
      setRememberCredentials(true);
    } catch {
      localStorage.removeItem(LOGIN_CREDENTIALS_KEY);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    login(
      { email, password },
      {
        onSuccess: () => {
          const cookiePreference = localStorage.getItem(COOKIE_PREFERENCE_KEY);

          if (rememberCredentials && cookiePreference === "all") {
            localStorage.setItem(
              LOGIN_CREDENTIALS_KEY,
              JSON.stringify({ email, password }),
            );
            return;
          }
          localStorage.removeItem(LOGIN_CREDENTIALS_KEY);
        },
        onError: (error) => {
          setErrorMessage(
            error?.message ?? "Unable to sign in. Please try again.",
          );
        },
      },
    );
  };

  return (
    <main className="mcurio-login-page">
      <div aria-hidden className="mcurio-login-blob mcurio-login-blob--top" />
      <div
        aria-hidden
        className="mcurio-login-blob mcurio-login-blob--bottom"
      />

      <section className="mcurio-login-shell">
        <header className="mcurio-login-header">
          <div className="mcurio-login-brand-icon-wrap">
            <span className="material-symbols-outlined mcurio-login-brand-icon">
              museum
            </span>
          </div>
          <h1 className="mcurio-login-brand-name">MCurio</h1>
          <p className="mcurio-login-brand-subtitle">Museum CMS</p>
        </header>

        <div className="mcurio-login-card">
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className="mcurio-login-form"
          >
            <div className="mcurio-login-form-heading">
              <h2 className="mcurio-login-form-title">Staff Authentication</h2>
              <p className="mcurio-login-form-subtitle">
                Access your collection
              </p>
            </div>

            <label className="mcurio-login-field">
              <span className="mcurio-login-field-label">email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mcurio-login-field-input"
              />
            </label>

            <label className="mcurio-login-field">
              <span className="mcurio-login-field-label">password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mcurio-login-field-input"
              />
            </label>

            <label className="mcurio-login-remember">
              <input
                type="checkbox"
                name="remember"
                checked={rememberCredentials}
                onChange={(event) =>
                  setRememberCredentials(event.target.checked)
                }
              />
              <span>Stay logged in on this device</span>
            </label>

            {errorMessage && (
              <p className="mcurio-login-error">{errorMessage}</p>
            )}

            <Button
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              className="mcurio-login-submit"
            >
              <span>{isLoading ? "Signing In" : "Enter Mcurio"}</span>
              <span className="material-symbols-outlined mcurio-login-submit-icon">
                arrow_forward
              </span>
            </Button>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <span style={{ color: "#666" }}>Don't have an account? </span>
              <Button
                type="link"
                onClick={() => navigate("/signup")}
                style={{ padding: 0 }}
              >
                Sign up for free
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};
