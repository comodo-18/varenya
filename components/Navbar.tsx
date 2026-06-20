"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, logout } from "@/lib/auth";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-hairline bg-porcelain/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-ink">
            Varenya<span className="text-moss">.</span>
          </Link>
          <nav className="flex items-center gap-6 font-body text-sm font-medium text-ink-soft">
            <Link href="/" className="transition-colors hover:text-ink">
              Shop
            </Link>
            <Link href="/admin" className="transition-colors hover:text-ink">
              Admin
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-ink">{user.username}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-hairline px-3 py-1.5 font-mono text-xs transition-colors hover:bg-hairline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="rounded-full bg-moss px-4 py-1.5 font-mono text-xs font-medium text-porcelain transition-colors hover:bg-moss-dark"
              >
                Sign in
              </button>
            )}
          </nav>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
