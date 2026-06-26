// frontend/app/dashboard/api-keys/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ApiKey {
  id: string;
  publishableKey: string;
  createdAt: string;
}

export default function ApiKeysPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.get("/api/v1/dashboard/keys")
        .then((res) => {
          setApiKeys(res.data);
          setFetchingData(false);
        })
        .catch(() => {
          // Fallback UI data
          setApiKeys([
            { id: "1", publishableKey: "pk_test_8f92bd3a7c64e5...", createdAt: new Date().toLocaleDateString() }
          ]);
          setFetchingData(false);
        });
    }
  }, [user]);

const handleGenerateKey = async () => {
    try {
      setFetchingData(true);
      const res = await api.post("/api/v1/dashboard/keys");
      // Add the new key to the UI immediately
      setApiKeys([res.data, ...apiKeys]); 
    } catch (err) {
      alert("Failed to generate key.");
    } finally {
      setFetchingData(false);
    }
  };

  if (loading || fetchingData) {
    return (
      <div className="ml-0 md:ml-64 p-10 flex items-center justify-center min-h-screen bg-ink">
        <p className="text-sand font-ibm-plex text-[12px] tracking-[0.15em] uppercase animate-pulse">Loading keys...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="ml-0 md:ml-64 p-10 max-w-7xl min-h-screen bg-ink">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-fraunces text-4xl text-ivory mb-2 tracking-tight">API & SDK Keys</h1>
          <p className="text-sand font-inter text-[15px] max-w-2xl">
            Manage authentication keys for your Lumina AI Virtual Try-On widget.
          </p>
        </div>
        <button 
          onClick={handleGenerateKey}
          className="bg-gold text-ink px-5 py-2.5 rounded-md text-[14px] font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Generate New Key
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-10">
        <div className="bg-[#1A1410] border border-gold/20 p-8 rounded-xl flex flex-col gap-6">
          <h3 className="font-fraunces text-2xl text-ivory">Active Keys</h3>
          {apiKeys.length === 0 ? (
            <p className="text-sand">No API keys generated yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-5 border border-gold/20 rounded-lg bg-[#211B15] flex justify-between items-center group hover:border-gold/40 transition-colors">
                  <div>
                    <span className="font-ibm-plex text-[11px] tracking-[0.1em] text-gold uppercase">PUBLISHABLE KEY</span>
                    <p className="font-ibm-plex text-[14px] text-ivory mt-2">{key.publishableKey}</p>
                    <p className="text-[12px] text-sand mt-2">Created: {key.createdAt}</p>
                  </div>
                  <button className="text-[#FF6B6B] text-[13px] font-bold hover:underline opacity-80 hover:opacity-100">
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#1A1410] border border-gold/20 p-8 rounded-xl flex flex-col gap-6">
          <h3 className="font-fraunces text-2xl text-ivory">Integration Snippet</h3>
          <p className="text-sand text-[14px]">
            Include the following code in your website&apos;s <code>&lt;head&gt;</code> or just before the closing <code>&lt;/body&gt;</code> tag to enable virtual try-on.
          </p>
          <div className="bg-[#0A0806] border border-gold/20 rounded-lg p-5 font-ibm-plex text-[13px] overflow-x-auto shadow-inner">
            <pre>
              <code className="text-[#E8C97A]">
{`<script 
  src="https://cdn.lumina-ai.com/widget.js" 
  data-key="${apiKeys.length > 0 ? apiKeys[0].publishableKey : 'YOUR_PUBLISHABLE_KEY'}">
</script>`}
              </code>
            </pre>
          </div>
          <p className="text-[12px] text-sand/70 mt-1 italic">
            * Note: This snippet will automatically map your AR assets to your store.
          </p>
        </div>
      </div>
    </main>
  );
}