"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, register } from "@/lib/auth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = "login" | "register";

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function reset() {
    setUsername("");
    setEmail("");
    setPassword("");
    setError(null);
    setLoading(false);
  }

  function switchTab(t: Tab) {
    setTab(t);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "login") {
        await login(username, password);
      } else {
        await register(username, email, password);
      }
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => { reset(); onClose(); }}
          />

          <motion.div
            className="relative z-10 w-full max-w-sm rounded-2xl border border-hairline bg-white p-6 shadow-xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="mb-5 flex items-center gap-1 rounded-full border border-hairline bg-porcelain p-1">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => switchTab(t)}
                  className={`flex-1 rounded-full px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider transition-colors ${
                    tab === t
                      ? "bg-moss text-porcelain"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {t === "login" ? "Sign in" : "Register"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Username
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-lg border border-hairline bg-porcelain px-3 py-2 font-body text-sm text-ink outline-none transition-colors focus:border-moss"
                />
              </label>

              <AnimatePresence mode="popLayout">
                {tab === "register" && (
                  <motion.label
                    className="flex flex-col gap-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                      Email
                    </span>
                    <input
                      type="email"
                      required={tab === "register"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-lg border border-hairline bg-porcelain px-3 py-2 font-body text-sm text-ink outline-none transition-colors focus:border-moss"
                    />
                  </motion.label>
                )}
              </AnimatePresence>

              <label className="flex flex-col gap-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Password
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border border-hairline bg-porcelain px-3 py-2 font-body text-sm text-ink outline-none transition-colors focus:border-moss"
                />
              </label>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 px-3 py-2 font-mono text-xs text-red-600"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="mt-1 rounded-full bg-moss px-6 py-2.5 font-mono text-sm font-medium text-porcelain transition-colors hover:bg-moss-dark disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-porcelain" />
                    {tab === "login" ? "Signing in…" : "Creating account…"}
                  </span>
                ) : tab === "login" ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
