"use client";

import { useState } from "react";
import { tableTemplates } from "@/data/table-templates";

export default function TableGenerator() {
  const [selected, setSelected] = useState(tableTemplates[0]);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(selected.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-lg font-semibold text-white">Gerador de tabelas</h2>
      <p className="mb-4 text-sm text-slate-400">
        Escolha um tipo de tabela pronta para o seu backend.
      </p>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {tableTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t)}
            className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
              selected.id === t.id
                ? "border-violet-500 bg-violet-600/20 text-white"
                : "border-white/10 bg-black/20 text-slate-300 hover:border-white/20"
            }`}
          >
            <p className="font-medium">{t.name}</p>
            <p className={`text-xs ${selected.id === t.id ? "text-violet-200" : "text-slate-500"}`}>
              {t.description}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-3 py-2">
          <span className="text-xs font-medium text-slate-400">prisma/schema.prisma</span>
          <button
            onClick={handleCopy}
            className="rounded-md border border-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-violet-400/60 hover:text-white"
          >
            {copied ? "Copiado ✓" : "Copiar"}
          </button>
        </div>
        <pre className="flex-1 overflow-auto bg-black/40 p-4 text-xs text-slate-200">
          <code>{selected.code}</code>
        </pre>
      </div>

      <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-600/10 p-3 text-xs text-violet-200">
        <p className="font-medium text-violet-100">Onde colar:</p>
        <p className="mt-1">
          Cole este bloco no final do arquivo <code>prisma/schema.prisma</code>.
          {selected.hint && (
            <>
              {" "}
              {selected.hint}.
            </>
          )}
          {" "}Depois rode <code>npm run db:migrate</code> pra criar a tabela de verdade no banco.
        </p>
      </div>
    </div>
  );
}
