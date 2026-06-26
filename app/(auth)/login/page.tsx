"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const S = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#15120E", padding: 24 },
  card: { width: "100%", maxWidth: 440, backgroundColor: "#1A1410", border: "1px solid rgba(201,162,75,0.2)", borderRadius: 12, padding: "48px 36px", boxSizing: "border-box" as const },
  logoRow: { display: "flex", flexDirection: "column" as const, alignItems: "center", marginBottom: 32, gap: 12 },
  logoMark: { width: 44, height: 44, border: "1px solid rgba(201,162,75,0.5)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(201,162,75,0.08)" },
  heading: { fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", color: "#F3EEE3", textAlign: "center" as const, margin: 0 },
  subtext: { fontFamily: "Inter, sans-serif", fontSize: 14, color: "#B8A99A", textAlign: "center" as const, marginTop: 4 },
  label: { display: "block", fontFamily: "IBM Plex Mono, monospace", fontSize: 11, letterSpacing: "0.1em", color: "#B8A99A", textTransform: "uppercase" as const, marginBottom: 8 },
  inputContainer: { position: "relative" as const, width: "100%" },
  input: { width: "100%", backgroundColor: "#211B15", border: "1px solid rgba(201,162,75,0.2)", borderRadius: 6, padding: "12px 14px", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#F3EEE3", outline: "none", boxSizing: "border-box" as const },
  eyeButton: { position: "absolute" as const, right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#B8A99A", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 },
  errorText: { fontFamily: "Inter, sans-serif", fontSize: 12, color: "#FF6B6B", marginTop: 5 },
  btn: { width: "100%", backgroundColor: "#C9A24B", color: "#15120E", border: "none", borderRadius: 6, padding: "14px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  errorBanner: { backgroundColor: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 6, padding: "12px 16px", marginBottom: 20, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#FF6B6B" },
  divider: { borderTop: "1px solid rgba(201,162,75,0.1)", marginTop: 28, paddingTop: 20, textAlign: "center" as const, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#B8A99A" },
  link: { color: "#C9A24B", textDecoration: "none", fontWeight: 600 },
};

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: { [k: string]: string } = {};
    if (!formData.email) e.email = "Email is required";
    if (!formData.password) e.password = "Password is required";
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setServerError(err.response?.data?.detail || "Invalid email or password.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logoRow}>
          <div style={S.logoMark}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#C9A24B" }}>diamond</span>
          </div>
          <h1 style={S.heading}>Welcome back</h1>
          <p style={S.subtext}>Sign in to your Lumina dashboard</p>
        </div>

        {serverError && <div style={S.errorBanner}>{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={S.label}>Work Email</label>
            <input id="email" name="email" type="email" placeholder="alex@example.com"
              style={{ ...S.input, ...(errors.email ? { borderColor: "#FF6B6B" } : {}) }}
              value={formData.email} onChange={handleChange} />
            {errors.email && <p style={S.errorText}>{errors.email}</p>}
          </div>
          
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ ...S.label, margin: 0 }}>Password</label>
              <Link href="/forgot-password" style={{ ...S.link, fontSize: 12 }}>Forgot password?</Link>
            </div>
            <div style={S.inputContainer}>
              <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                style={{ ...S.input, ...(errors.password ? { borderColor: "#FF6B6B" } : {}), paddingRight: 40 }}
                value={formData.password} onChange={handleChange} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={S.eyeButton}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {errors.password && <p style={S.errorText}>{errors.password}</p>}
          </div>
          
          <button type="submit" disabled={loading}
            style={{ ...S.btn, ...(loading ? { opacity: 0.6, cursor: "not-allowed" } : {}) }}>
            {loading ? <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>Signing in…</> : "Sign In →"}
          </button>
        </form>

        <div style={S.divider}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={S.link}>Create one</Link>
        </div>
      </div>
    </div>
  );
}