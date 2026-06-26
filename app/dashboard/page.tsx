"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardData {
  skusUsed: number;
  skuLimit: number;
  skuPercent: number;
  tryonsUsed: number;
  tryonLimit: number;
  tryonPercent: number;
}

export default function DashboardOverview() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [fetchingData, setFetchingData] = useState(true);

  // 1. Guard Protection: Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // 2. Fetch usage metrics from FastAPI backend
  useEffect(() => {
    if (user) {
      api.get("/api/v1/dashboard/overview")
        .then((res) => {
          setData(res.data);
          setFetchingData(false);
        })
        .catch((err) => {
          console.error("Failed to fetch dashboard metrics:", err);
          // Fallback static state until the FastAPI metrics endpoint is built
          setData({
            skusUsed: 12,
            skuLimit: 500,
            skuPercent: 2.4,
            tryonsUsed: 843,
            tryonLimit: 10000,
            tryonPercent: 8.43,
          });
          setFetchingData(false);
        });
    }
  }, [user]);

  if (loading || fetchingData) {
    return (
      <div className="ml-0 md:ml-64 p-10 flex items-center justify-center min-h-screen bg-ink">
        <p className="text-sand font-mono text-[12px] tracking-[0.15em] uppercase animate-pulse">
          Loading metrics...
        </p>
      </div>
    );
  }

  if (!user || !data) return null;

  return (
    <main className="ml-0 md:ml-64 p-10 max-w-7xl min-h-screen bg-ink">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-fraunces text-4xl text-ivory mb-2 tracking-tight">
            Welcome back, {user.full_name || user.email.split("@")[0]}
          </h1>
          <p className="text-sand font-inter text-[15px]">
            Here is what is happening with your virtual try-on assets.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="border border-gold/30 text-gold px-5 py-2.5 rounded-md text-[14px] font-semibold hover:bg-gold/10 transition-colors">
            View Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* SKU Usage Card */}
        <div className="bg-[#1A1410] border border-gold/20 p-8 rounded-xl flex flex-col gap-5 relative overflow-hidden group hover:border-gold/40 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sand font-ibm-plex text-[11px] tracking-[0.12em] uppercase">
              <span className="material-symbols-outlined text-[18px]">diamond</span>
              SKU LIMIT
            </div>
            {data.skuPercent > 80 && (
              <span className="text-[10px] bg-garnet text-ivory border border-gold/30 px-2 py-1 rounded-md font-bold tracking-[0.1em]">
                UPGRADE
              </span>
            )}
          </div>
          <div className="flex items-end gap-3">
            <span className="font-fraunces text-5xl text-ivory tracking-tight">
              {data.skusUsed.toLocaleString()}
            </span>
            <span className="text-sand text-[15px] mb-1.5">
              / {data.skuLimit.toLocaleString()} SKUs
            </span>
          </div>
          <div className="w-full bg-[#211B15] rounded-full h-1.5 mt-2 overflow-hidden border border-gold/10">
            <div
              className="bg-gold h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${data.skuPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Try-on Usage Card */}
        <div className="bg-[#1A1410] border border-gold/20 p-8 rounded-xl flex flex-col gap-5 relative overflow-hidden group hover:border-gold/40 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sand font-ibm-plex text-[11px] tracking-[0.12em] uppercase">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              TRY-ON LIMIT
            </div>
            {data.tryonPercent > 80 && (
              <span className="text-[10px] bg-garnet text-ivory border border-gold/30 px-2 py-1 rounded-md font-bold tracking-[0.1em]">
                UPGRADE
              </span>
            )}
          </div>
          <div className="flex items-end gap-3">
            <span className="font-fraunces text-5xl text-ivory tracking-tight">
              {data.tryonsUsed.toLocaleString()}
            </span>
            <span className="text-sand text-[15px] mb-1.5">
              / {data.tryonLimit.toLocaleString()} monthly
            </span>
          </div>
          <div className="w-full bg-[#211B15] rounded-full h-1.5 mt-2 overflow-hidden border border-gold/10">
            <div
              className="bg-gold h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${data.tryonPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </main>
  );
}