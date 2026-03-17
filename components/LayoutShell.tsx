"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { useAuth } from "@/contexts/AuthContext";

const VIEW_AS_LABELS: Record<string, string> = {
  public: "Public (Logged Out)",
  kit_buyer: "Kit Buyer",
  certified_borrower: "Certified Borrower",
  partner: "Partner",
};

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const { viewAs, clearViewAs } = useAuth();

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {viewAs && (
        <div className="sticky top-0 z-[60] flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
          <span>
            Viewing site as: <strong>{VIEW_AS_LABELS[viewAs] ?? viewAs}</strong>
          </span>
          <button
            onClick={() => {
              clearViewAs();
              window.close();
            }}
            className="rounded-md bg-white/20 px-3 py-0.5 text-xs font-bold hover:bg-white/30 transition"
          >
            Exit Preview
          </button>
        </div>
      )}
      {!viewAs && <Navigation />}
      {viewAs && <Navigation hideHeader />}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
