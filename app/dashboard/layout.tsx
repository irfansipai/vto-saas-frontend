// frontend/app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <TopHeader />
      <div className="min-h-screen">
        {children}
      </div>
    </>
  );
}
