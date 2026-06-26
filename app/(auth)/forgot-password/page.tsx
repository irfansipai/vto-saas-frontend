"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#15120E", padding: 24 },
  card: { width: "100%", maxWidth: 440, backgroundColor: "#1A1410", border: "1px solid rgba(201,162,75,0.2)", borderRadius: 12, padding: "48px 36px", boxSizing: "border-box" as const },
  logoRow: { display: "flex", flexDirection: "column" as const, alignItems: "center", marginBottom: 32, gap: 12 },
  logoMark: { width: 44, height: 44, border: "1px solid rgba(201,162,75,0.5)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(201,162,75,0.08)" },
  heading: { fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", color: "#F3EEE3", textAlign: "center" as const, margin: 0 },
  subtext: { fontFamily: "Inter, sans-serif", fontSize: 14, color: "#B8A99A", textAlign: "center" as const, marginTop: 6 },
  label: { display: "block", fontFamily: "IBM Plex Mono, monospace", fontSize: 11, letterSpacing: "0.1em", color: "#B8A99A", textTransform: "uppercase" as const, marginBottom: 8 },
  input: { width: "100%", backgroundColor: "#211B15", border: "1px solid rgba(201,162,75,0.2)", borderRadius: 6, padding: "12px 14px", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#F3EEE3", outline: "none", boxSizing: "border-box" as const },
  btn: { width: "100%", backgroundColor: "#C9A24B", color: "#15120E", border: "none", borderRadius: 6, padding: "14px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" as const },
  successBanner: { backgroundColor: "rgba(201,162,75,0.08)", border: "1px solid rgba(201,162,75,0.3)", borderRadius: 6, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20 },
  errorBanner: { backgroundColor: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 6, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20 },
  link: { color: "#C9A24B", textDecoration: "none", fontWeight: 600 },
  divider: { borderTop: "1px solid rgba(201,162,75,0.1)", marginTop: 28, paddingTop: 20, textAlign: "center" as const, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#B8A99A" },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Direct call to your FastAPI /auth/forgot-password route
      await api.post("/api/v1/auth/forgot-password", { email });
      setMessage("If an account exists with that email, we have sent a password reset link.");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to initiate password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoMark}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#C9A24B" }}>lock_reset</span>
          </div>
          <h1 style={styles.heading}>Reset Password</h1>
          <p style={styles.subtext}>Enter your email to receive a recovery link</p>
        </div>

        {message && (
          <div style={styles.successBanner}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#C9A24B" }}>check_circle</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#F3EEE3" }}>{message}</span>
          </div>
        )}

        {error && (
          <div style={styles.errorBanner}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#FF6B6B" }}>error</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#FF6B6B" }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={styles.label}>Work Email</label>
            <input 
              id="email" name="email" type="email" required
              style={styles.input}
              placeholder="alex@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !email}
            style={{ ...styles.btn, ...((loading || !email) ? styles.btnDisabled : {}) }}
          >
            {loading ? (
              <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span> Sending...</>
            ) : "Send Reset Link"}
          </button>
        </form>

        <div style={styles.divider}>
          Remembered your password? <Link href="/login" style={styles.link}>Log in</Link>
        </div>
      </div>
    </div>
  );
}