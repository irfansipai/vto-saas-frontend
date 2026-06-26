// frontend/app/dashboard/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [allowedDomains, setAllowedDomains] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.get("/api/v1/tenant")
        .then(res => {
          if (res.data && res.data.allowedDomains) {
            try {
              const domains = JSON.parse(res.data.allowedDomains);
              setAllowedDomains(domains.join(", "));
            } catch(e) {}
          }
        }).catch(() => {
          // Graceful fallback if endpoint doesn't exist yet
        });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const domainsArray = allowedDomains.split(",").map(d => d.trim()).filter(Boolean);
    
    try {
      await api.put("/api/v1/tenant", { allowedDomains: JSON.stringify(domainsArray) });
      setMessage("Settings saved successfully.");
    } catch(err: any) {
      setMessage(err.response?.data?.detail || "Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <main className="ml-0 md:ml-64 p-10 max-w-7xl min-h-screen bg-ink">
      <div className="mb-12">
        <h1 className="font-fraunces text-4xl text-ivory mb-2 tracking-tight">Settings</h1>
        <p className="text-sand font-inter text-[15px] max-w-2xl">
          Manage your business profile and widget security settings.
        </p>
      </div>

      <div className="max-w-3xl flex flex-col gap-8">
        <div className="bg-[#1A1410] border border-gold/20 rounded-xl p-10">
          <h3 className="font-fraunces text-2xl text-ivory mb-4">Security & CORS Allowed Domains</h3>
          <p className="text-sand text-[14px] mb-8 leading-relaxed">
            Restrict the Virtual Try-On widget to only load on these specific domains. Provide a comma-separated list of origins (e.g. <code className="text-gold font-ibm-plex">https://yourstore.com, https://shop.yourstore.com</code>). Leave empty to allow all domains (not recommended for production).
          </p>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 border ${message.includes("success") ? 'bg-[#15201A] text-[#81C784] border-[#81C784]/30' : 'bg-garnet/40 text-ivory border-[#FF6B6B]/30'}`}>
              <span className="material-symbols-outlined text-[20px]">{message.includes("success") ? 'check_circle' : 'error'}</span>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div>
              <label className="block font-ibm-plex text-[11px] tracking-[0.1em] text-sand uppercase mb-2" htmlFor="allowedDomains">Allowed Domains</label>
              <input 
                id="allowedDomains" name="allowedDomains" type="text" 
                className="w-full bg-[#211B15] border border-gold/20 rounded-md px-4 py-3 text-[14px] text-ivory focus:outline-none focus:border-gold transition-colors"
                placeholder="https://example.com"
                value={allowedDomains} onChange={(e) => setAllowedDomains(e.target.value)}
              />
            </div>
            <div className="flex justify-end pt-4 border-t border-gold/10">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gold text-ink font-bold py-2.5 px-6 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Saving...</> : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}