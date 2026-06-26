"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyGround: "center", displayFlex: "flex", justifyContent: "center", backgroundColor: "#15120E", padding: 24 },
  card: { width: "100%", maxWidth: 440, backgroundColor: "#1A1410", border: "1px solid rgba(201,162,75,0.2)", borderRadius: 12, padding: "48px 36px", boxSizing: "border-box" as const },
  logoRow: { display: "flex", flexDirection: "column" as const, alignItems: "center", marginBottom: 32, gap: 12 },
  logoMark: { width: 44, height: 44, border: "1px solid rgba(201,162,75,0.5)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(201,162,75,0.08)" },
  heading: { fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", color: "#F3EEE3", textAlign: "center" as const, margin: 0 },
  subtext: { fontFamily: "Inter, sans-serif", fontSize: 14, color: "#B8A99A", textAlign: "center" as const, marginTop: 6 },
  label: { display: "block", fontFamily: "IBM Plex Mono, monospace", fontSize: 11, letterSpacing: "0.1em", color: "#B8A99A", textTransform: "uppercase" as const, marginBottom: 8 },
  inputContainer: { position: "relative" as const, width: "100%" },
  input: { width: "100%", backgroundColor: "#211B15", border: "1px solid rgba(201,162,75,0.2)", borderRadius: 6, padding: "12px 14px", fontFamily: "Inter, sans-serif", fontSize: 14, color: "#F3EEE3", outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.2s" },
  inputError: { borderColor: "#FF6B6B" },
  eyeButton: { position: "absolute" as const, right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#B8A99A", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 },
  errorText: { fontFamily: "Inter, sans-serif", fontSize: 12, color: "#FF6B6B", marginTop: 6 },
  btn: { width: "100%", backgroundColor: "#C9A24B", color: "#15120E", border: "none", borderRadius: 6, padding: "14px 0", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" as const },
  errorBanner: { backgroundColor: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 6, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20 },
  link: { color: "#C9A24B", textDecoration: "none", fontWeight: 600 },
  divider: { borderTop: "1px solid rgba(201,162,75,0.1)", marginTop: 28, paddingTop: 20, textAlign: "center" as const, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#B8A99A" },
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", businessName: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!formData.name) e.name = "Full name is required";
    if (!formData.businessName) e.businessName = "Business name is required";
    if (!formData.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Invalid email format";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "At least 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/api/v1/users/", { 
        email: formData.email, 
        password: formData.password,
        full_name: formData.name,
        business_name: formData.businessName
      });
      router.push("/login");
    } catch (err: any) { 
      setServerError(err.response?.data?.detail || "Failed to create account."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoMark}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#C9A24B" }}>diamond</span>
          </div>
          <h1 style={styles.heading}>Create your account</h1>
          <p style={styles.subtext}>Start your luxury AR try-on journey</p>
        </div>

        {serverError && (
          <div style={styles.errorBanner}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#FF6B6B" }}>error</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#FF6B6B" }}>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={styles.label}>Full Name</label>
            <input
              id="name" name="name" type="text" placeholder="Alex Sterling"
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              value={formData.name} onChange={handleChange}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={styles.label}>Business Name</label>
            <input
              id="businessName" name="businessName" type="text" placeholder="Sterling Jewelers"
              style={{ ...styles.input, ...(errors.businessName ? styles.inputError : {}) }}
              value={formData.businessName} onChange={handleChange}
            />
            {errors.businessName && <p style={styles.errorText}>{errors.businessName}</p>}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={styles.label}>Work Email</label>
            <input
              id="email" name="email" type="email" placeholder="alex@sterlingjewelers.com"
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              value={formData.email} onChange={handleChange}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <input
                id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                style={{ ...styles.input, ...(errors.password ? styles.inputError : {}), paddingRight: 40 }}
                value={formData.password} onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {errors.password && <p style={styles.errorText}>{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}>
            {loading ? <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>Creating account…</> : "Create Account →"}
          </button>
        </form>

        <div style={styles.divider}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}