import { FormEvent, useState } from "react";
import { Button, Alert } from "antd";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";

export const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        // Email confirmation required
        setSuccessMessage(
          "Please check your email for a confirmation link to complete your registration.",
        );
      } else if (data.session) {
        // User signed up and logged in successfully
        navigate("/onboarding");
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || "Unable to create account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
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
              <h2 className="mcurio-login-form-title">Create Account</h2>
              <p className="mcurio-login-form-subtitle">
                Start your 7-day free trial
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
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="mcurio-login-field-input"
              />
            </label>

            <label className="mcurio-login-field">
              <span className="mcurio-login-field-label">confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={6}
                className="mcurio-login-field-input"
              />
            </label>

            {errorMessage && (
              <Alert
                message={errorMessage}
                type="error"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}

            {successMessage && (
              <Alert
                message={successMessage}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}

            <Button
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              className="mcurio-login-submit"
            >
              <span>
                {isLoading ? "Creating Account..." : "Start Free Trial"}
              </span>
              <span className="material-symbols-outlined mcurio-login-submit-icon">
                arrow_forward
              </span>
            </Button>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <span style={{ color: "#666" }}>Already have an account? </span>
              <Button
                type="link"
                onClick={() => navigate("/login")}
                style={{ padding: 0 }}
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};
