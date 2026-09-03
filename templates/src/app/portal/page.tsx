"use client";

import { useState } from "react";
import AIGenerator from "./components/AIGenerator";
import RequestClient from "./components/RequestClient";
import TableGenerator from "./components/TableGenerator";

const TABS = [
  { id: "ai", label: "IA de código" },
  { id: "http", label: "HTTP Client" },
  { id: "templates", label: "Templates" },
] as const;

export default function PortalPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("ai");

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-violet-600/20 px-3 py-1 text-xs font-medium text-violet-300">
              GBIT Portal
            </span>
            <h1 className="mt-2 text-2xl font-semibold">Ferramentas de backend</h1>
            <p className="text-sm text-slate-400">
              Teste endpoints, gere tabelas e peça código pronto para o seu backend.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-right font-mono text-xs text-slate-400">
            <p>portal · http://localhost:4100/portal</p>
            <p>container · http://localhost:4300</p>
          </div>
        </div>
      </header>

      <nav className="border-b border-white/10 px-6">
        <div className="mx-auto flex max-w-5xl gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm transition ${
                tab === t.id
                  ? "border-violet-500 text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl p-6">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          {tab === "ai" && <AIGenerator />}
          {tab === "http" && <RequestClient />}
          {tab === "templates" && <TableGenerator />}
        </section>
      </main>
    </div>
  );
}