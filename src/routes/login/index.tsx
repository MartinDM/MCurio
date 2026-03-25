import { FormEvent, useEffect, useState } from "react";

import { useLogin } from "@refinedev/core";

export const LoginPage = () => {
  const { mutate: login, isLoading } = useLogin<{
    email: string;
    password: string;
  }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberCredentials, setRememberCredentials] = useState(false);
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
    <main
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundImage:
          'linear-gradient(90deg, rgba(249, 249, 247, 0.9) 0%, rgba(249, 249, 247, 0.68) 42%, rgba(249, 249, 247, 0.42) 70%, rgba(249, 249, 247, 0.08) 100%), url("/login-background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        color: "#2d3432",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-220px",
          right: "-200px",
          width: "500px",
          height: "500px",
          borderRadius: "9999px",
          background: "rgba(255, 223, 158, 0.28)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: "-220px",
          left: "-200px",
          width: "420px",
          height: "420px",
          borderRadius: "9999px",
          background: "rgba(195, 224, 254, 0.32)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <section
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        <header style={{ textAlign: "center", marginBottom: 44 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 38, color: "#5d5e61" }}
            >
              museum
            </span>
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: '"Noto Serif", serif',
              fontStyle: "italic",
              fontSize: 34,
              letterSpacing: "-1px",
              color: "#5d5e61",
            }}
          >
            MCurio
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 12,
              color: "#767c79",
              letterSpacing: "0.18em",
              fontVariant: "small-caps",
            }}
          >
            Museum CMS
          </p>
        </header>

        <div
          style={{
            background: "#f2f4f2",
            border: "1px solid rgba(173, 179, 176, 0.24)",
            borderRadius: 6,
            padding: 28,
            boxShadow: "0 10px 26px rgba(45, 52, 50, 0.06)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            style={{ display: "grid", gap: 20 }}
          >
            <div
              style={{
                borderLeft: "2px solid #735c28",
                paddingLeft: 12,
                marginBottom: 8,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: '"Noto Serif", serif',
                  fontSize: 24,
                }}
              >
                Staff Authentication
              </h2>
              <p style={{ margin: "6px 0 0", color: "#5a605e", fontSize: 14 }}>
                Access your curation suite.
              </p>
            </div>

            <label style={{ display: "grid", gap: 6 }}>
              <span
                style={{
                  textTransform: "uppercase",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: "#767c79",
                  fontWeight: 600,
                }}
              >
                email
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="curator@museum.org"
                style={{
                  border: "none",
                  borderBottom: "1px solid #767c79",
                  background: "transparent",
                  padding: "8px 0",
                  fontSize: 14,
                  color: "#2d3432",
                  outline: "none",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span
                style={{
                  textTransform: "uppercase",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: "#767c79",
                  fontWeight: 600,
                }}
              >
                password
              </span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="••••••••"
                style={{
                  border: "none",
                  borderBottom: "1px solid #767c79",
                  background: "transparent",
                  padding: "8px 0",
                  fontSize: 14,
                  color: "#2d3432",
                  outline: "none",
                }}
              />
            </label>

            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "#5a605e",
                fontSize: 12,
              }}
            >
              <input
                type="checkbox"
                name="remember"
                checked={rememberCredentials}
                onChange={(event) =>
                  setRememberCredentials(event.target.checked)
                }
              />
              <span>Persist session for this workstation</span>
            </label>

            {errorMessage && (
              <p style={{ margin: 0, color: "#9f403d", fontSize: 13 }}>
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "none",
                borderRadius: 4,
                background: "#5d5e61",
                color: "#f7f7fa",
                padding: "12px 16px",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.8 : 1,
              }}
            >
              <span>{isLoading ? "Signing In" : "Enter Mcurio"}</span>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                arrow_forward
              </span>
            </button>
          </form>
        </div>

        <footer style={{ marginTop: 36, textAlign: "center" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", justifyItems: "center", gap: 4 }}>
              <span
                className="material-symbols-outlined"
                style={{ color: "#adb3b0", fontSize: 19 }}
              >
                inventory_2
              </span>
              <span
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  color: "#767c79",
                }}
              >
                Inventory Management
              </span>
            </div>
            <div style={{ display: "grid", justifyItems: "center", gap: 4 }}>
              <span
                className="material-symbols-outlined"
                style={{ color: "#adb3b0", fontSize: 19 }}
              >
                brush
              </span>
              <span
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  color: "#767c79",
                }}
              >
                Exhibition Tools
              </span>
            </div>
            <div style={{ display: "grid", justifyItems: "center", gap: 4 }}>
              <span
                className="material-symbols-outlined"
                style={{ color: "#adb3b0", fontSize: 19 }}
              >
                contacts
              </span>
              <span
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  color: "#767c79",
                }}
              >
                Industry Contacts
              </span>
            </div>
          </div>

          <p
            style={{
              margin: "18px auto 0",
              maxWidth: 300,
              fontSize: 11,
              color: "#767c79",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          ></p>
        </footer>
      </section>
    </main>
  );
};
