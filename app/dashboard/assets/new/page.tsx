// frontend/app/dashboard/assets/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function NewAssetPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: "", category: "ring" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setErrors({ ...errors, imageFile: "" });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!imageFile) newErrors.imageFile = "An image file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  try {
    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("category", formData.category);
    if (imageFile) uploadData.append("file", imageFile);

    // DO NOT set 'Content-Type' header here. 
    // Axios does this automatically with the correct boundary!
    await api.post("/api/v1/assets/", uploadData); 
    router.push("/dashboard/assets");
  } catch (err: any) {
      // FIX: Safely extract the message string from the error object
      const message = err.response?.data?.detail || 
                      err.response?.data?.message || 
                      "Failed to create asset.";
      setServerError(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setLoading(false);
  }
};

  if (authLoading || !user) return null;

  return (
    <main className="ml-0 md:ml-64 p-10 max-w-7xl min-h-screen bg-ink">
      <div className="mb-10">
        <Link href="/dashboard/assets" className="text-sand hover:text-gold flex items-center gap-1 text-[13px] font-medium mb-6 w-max transition-colors">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Assets
        </Link>
        <h1 className="font-fraunces text-4xl text-ivory mb-2 tracking-tight">Add New Asset</h1>
        <p className="text-sand font-inter text-[15px] max-w-2xl">
          Upload a new jewelry piece to your virtual try-on catalog.
        </p>
      </div>

      <div className="max-w-2xl bg-[#1A1410] border border-gold/20 rounded-xl p-10">
        {serverError && (
          <div className="mb-8 p-4 bg-garnet/40 text-ivory border border-[#FF6B6B]/30 rounded-lg text-sm flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-[#FF6B6B]">error</span>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div>
            <label className="block font-ibm-plex text-[11px] tracking-[0.1em] text-sand uppercase mb-2" htmlFor="name">Asset Name</label>
            <input 
              id="name" name="name" type="text" 
              className={`w-full bg-[#211B15] border ${errors.name ? 'border-[#FF6B6B]' : 'border-gold/20'} rounded-md px-4 py-3 text-[14px] text-ivory focus:outline-none focus:border-gold transition-colors`}
              placeholder="18k Gold Diamond Ring"
              value={formData.name} onChange={handleChange}
            />
            {errors.name && <p className="text-[#FF6B6B] text-[12px] mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>{errors.name}</p>}
          </div>

          <div>
            <label className="block font-ibm-plex text-[11px] tracking-[0.1em] text-sand uppercase mb-2" htmlFor="category">Category</label>
            <select 
              id="category" name="category"
              className="w-full bg-[#211B15] border border-gold/20 rounded-md px-4 py-3 text-[14px] text-ivory focus:outline-none focus:border-gold transition-colors appearance-none"
              value={formData.category} onChange={handleChange}
            >
              <option value="ring">Ring</option>
              <option value="necklace">Necklace</option>
              <option value="earring">Earring</option>
              <option value="bracelet">Bracelet</option>
              <option value="watch">Watch</option>
            </select>
          </div>

          <div>
            <label className="block font-ibm-plex text-[11px] tracking-[0.1em] text-sand uppercase mb-2" htmlFor="file">Reference Image</label>
            <input 
              id="file" name="file" type="file" accept="image/*"
              className={`w-full bg-[#211B15] border ${errors.imageFile ? 'border-[#FF6B6B]' : 'border-gold/20'} rounded-md px-4 py-2.5 text-[14px] text-sand file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[13px] file:font-semibold file:bg-gold file:text-ink hover:file:opacity-90 focus:outline-none focus:border-gold transition-colors cursor-pointer`}
              onChange={handleFileChange}
            />
            <p className="text-[12px] text-sand mt-2">Upload a transparent 2D reference PNG.</p>
            {errors.imageFile && <p className="text-[#FF6B6B] text-[12px] mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>{errors.imageFile}</p>}
          </div>

          <div className="pt-8 mt-2 border-t border-gold/10 flex justify-end gap-4">
            <Link href="/dashboard/assets" className="px-5 py-2.5 rounded-md text-[14px] font-semibold text-sand hover:text-ivory hover:bg-gold/10 transition-colors">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gold text-ink font-bold py-2.5 px-6 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Uploading...</>
              ) : "Upload Asset"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}