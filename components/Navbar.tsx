"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data } = useSession();
  const role = data?.user?.role;

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Image src="/ergo-logo.svg" alt="ERGO" width={130} height={36} className="h-8 w-auto" />
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Fund4
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
          {role === "admin" && (
            <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Admin
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
