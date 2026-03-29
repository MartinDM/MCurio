import { FormEvent, useEffect, useState } from "react";

import { useLogin } from "@refinedev/core";
import { Button } from "antd";

export const LoginPage = () => {
  const { mutate: login, isLoading } = useLogin<{
    email: string;
    password: string;
  }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberCredentials, setRememberCredentials] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mcurio:login-credentials");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { email?: string; password?: string };
      setEmail(parsed.email ?? "");
      setPassword(parsed.password ?? "");
      setRememberCredentials(true);
    } catch {
      localStorage.removeItem("mcurio:login-credentials");
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    login(
      { email, password },
      {
        onSuccess: () => {
          if (rememberCredentials) {
            localStorage.setItem(
              "mcurio:login-credentials",
              JSON.stringify({ email, password }),
            );
            return;
          }
          localStorage.removeItem("mcurio:login-credentials");
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
              <span>Stay logged in</span>
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
          </form>
        </div>

        <footer className="mcurio-login-footer">
          <div className="mcurio-login-feature-grid">
            <div className="mcurio-login-feature-item">
              <span className="material-symbols-outlined mcurio-login-feature-icon">
                inventory_2
              </span>
              <span className="mcurio-login-feature-label">
                Inventory Management
              </span>
            </div>
            <div className="mcurio-login-feature-item">
              <span className="material-symbols-outlined mcurio-login-feature-icon">
                brush
              </span>
              <span className="mcurio-login-feature-label">
                Exhibition Tools
              </span>
            </div>
            <div className="mcurio-login-feature-item">
              <span className="material-symbols-outlined mcurio-login-feature-icon">
                contacts
              </span>
              <span className="mcurio-login-feature-label">
                Industry Contacts
              </span>
            </div>
          </div>

          <p className="mcurio-login-footer-note"></p>
        </footer>
      </section>
    </main>
  );
};
