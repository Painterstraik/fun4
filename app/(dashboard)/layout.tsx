import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </div>
    </RequireAuth>
  );
}
