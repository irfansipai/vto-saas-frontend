// frontend/app/dashboard/assets/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Sku {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

export default function AssetsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [skus, setSkus] = useState<Sku[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.get("/api/v1/assets")
        .then((res) => {
          setSkus(res.data);
          setFetchingData(false);
        })
        .catch(() => {
          // Fallback UI data until the backend endpoint is ready
          setSkus([
            { id: "1", name: "18k Gold Diamond Ring", category: "ring", imageUrl: "/hero-ring.png", createdAt: new Date().toLocaleDateString() }
          ]);
          setFetchingData(false);
        });
    }
  }, [user]);

  if (loading || fetchingData) {
    return (
      <div className="ml-0 md:ml-64 p-10 flex items-center justify-center min-h-screen bg-ink">
        <p className="text-sand font-ibm-plex text-[12px] tracking-[0.15em] uppercase animate-pulse">Loading assets...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="ml-0 md:ml-64 p-10 max-w-7xl min-h-screen bg-ink">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-fraunces text-4xl text-ivory mb-2 tracking-tight">Assets</h1>
          <p className="text-sand font-inter text-[15px] max-w-2xl">
            Manage your 3D assets and SKUs available for virtual try-on.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/assets/new" className="bg-gold text-ink px-5 py-2.5 rounded-md text-[14px] font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New SKU
          </Link>
        </div>
      </div>

      <div className="bg-[#1A1410] border border-gold/20 rounded-xl overflow-hidden">
        {skus.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#211B15] rounded-full flex items-center justify-center mb-5 border border-gold/10">
              <span className="material-symbols-outlined text-3xl text-gold">diamond</span>
            </div>
            <h3 className="font-fraunces text-2xl text-ivory mb-3">No assets found</h3>
            <p className="text-sand text-[14px] mb-8 max-w-md">
              You haven&apos;t uploaded any jewelry assets yet. Add your first SKU to get started with virtual try-on.
            </p>
            <Link href="/dashboard/assets/new" className="border border-gold/30 text-gold px-5 py-2.5 rounded-md text-[14px] font-semibold hover:bg-gold/10 transition-colors">
              Add First Asset
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-inter">
              <thead className="bg-[#211B15] border-b border-gold/10 text-sand font-ibm-plex text-[11px] tracking-[0.1em] uppercase">
                <tr>
                  <th className="px-6 py-4 font-normal">ASSET</th>
                  <th className="px-6 py-4 font-normal">CATEGORY</th>
                  <th className="px-6 py-4 font-normal">DATE ADDED</th>
                  <th className="px-6 py-4 font-normal text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {skus.map((sku) => (
                  <tr key={sku.id} className="hover:bg-gold/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#211B15] rounded-md bg-cover bg-center border border-gold/20" style={{ backgroundImage: `url(${sku.imageUrl})` }} />
                        <span className="font-semibold text-ivory">{sku.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-sand">{sku.category}</td>
                    <td className="px-6 py-4 text-sand">{sku.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gold hover:underline font-medium text-[13px]">Edit</button>
                      <span className="text-gold/30 mx-3">|</span>
                      <button className="text-[#FF6B6B] hover:underline font-medium text-[13px]">Delete</button>
                    </td>
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