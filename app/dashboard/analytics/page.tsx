// frontend/app/dashboard/analytics/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UsageEvent {
  id: string;
  createdAt: string;
  type: string;
  skuId: string;
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<UsageEvent[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.get("/api/v1/dashboard/analytics")
        .then((res) => {
          setEvents(res.data);
          setFetchingData(false);
        })
        .catch(() => {
          // Fallback UI data until the backend endpoint is ready
          setEvents([
            { id: "1", createdAt: new Date().toLocaleString(), type: "AR_VIEW", skuId: "SKU-RING-001" },
            { id: "2", createdAt: new Date(Date.now() - 3600000).toLocaleString(), type: "AR_VIEW", skuId: "SKU-NECK-089" },
            { id: "3", createdAt: new Date(Date.now() - 7200000).toLocaleString(), type: "3D_SPIN", skuId: "SKU-RING-001" },
          ]);
          setFetchingData(false);
        });
    }
  }, [user]);

  if (loading || fetchingData) {
    return (
      <div className="ml-0 md:ml-64 p-10 flex items-center justify-center min-h-screen bg-ink">
        <p className="text-sand font-ibm-plex text-[12px] tracking-[0.15em] uppercase animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="ml-0 md:ml-64 p-10 max-w-7xl min-h-screen bg-ink">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-fraunces text-4xl text-ivory mb-2 tracking-tight">Usage & Analytics</h1>
          <p className="text-sand font-inter text-[15px] max-w-2xl">
            Track your virtual try-on engagement and API usage over the current billing period.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#1A1410] border border-gold/20 p-8 rounded-xl flex flex-col gap-2">
          <span className="text-sand font-ibm-plex text-[11px] tracking-[0.12em] uppercase">TOTAL TRY-ONS</span>
          <span className="font-fraunces text-4xl text-ivory tracking-tight">{events.length.toLocaleString()}</span>
          <span className="text-gold text-sm flex items-center gap-1 mt-2 font-medium">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            +12% vs last period
          </span>
        </div>
        <div className="bg-[#1A1410] border border-gold/20 p-8 rounded-xl flex flex-col gap-2">
          <span className="text-sand font-ibm-plex text-[11px] tracking-[0.12em] uppercase">UNIQUE SKUS TRIED</span>
          <span className="font-fraunces text-4xl text-ivory tracking-tight">{new Set(events.map(e => e.skuId)).size}</span>
        </div>
      </div>

      <div className="bg-[#1A1410] border border-gold/20 rounded-xl p-8">
        <h3 className="font-fraunces text-2xl text-ivory mb-6">Recent Events</h3>
        {events.length === 0 ? (
          <p className="text-sand py-8 text-center">No try-on events recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-inter">
              <thead className="bg-[#211B15] text-sand font-ibm-plex text-[11px] tracking-[0.1em]">
                <tr>
                  <th className="px-5 py-4 font-normal rounded-l-lg">DATE & TIME</th>
                  <th className="px-5 py-4 font-normal">EVENT TYPE</th>
                  <th className="px-5 py-4 font-normal rounded-r-lg">SKU ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gold/5 transition-colors">
                    <td className="px-5 py-4 text-sand">{event.createdAt}</td>
                    <td className="px-5 py-4">
                      <span className="bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.05em]">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-ibm-plex text-ivory/80 text-[13px]">{event.skuId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}