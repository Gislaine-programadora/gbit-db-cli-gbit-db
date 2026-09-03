"use client";

import { useState } from "react";

type Block = { id: string; title: string; language: string; code: string };
type Result = { entity: string; summary: string; blocks: Block[] };

const EXAMPLES = [
  "tabela de produtos com nome, preco, estoque, ativo",
  "crie uma api de clientes com nome, email, telefone, cidade",
  "crud de pedidos com valor, status, dataEntrega, pago",
  "tabela de posts com titulo, slug, conteudo, publicado",
];

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function run(value?: string) {
    const text = (value ?? prompt).trim();
    if (!text) return;
    setPrompt(text);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/portal/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao gerar");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function copy(block: Block) {
    await navigator.clipboard.writeText(block.code);
    setCopied(block.id);
    setTimeout(() => setCopied(""), 1400);
  }

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-lg font-semibold text-white">Gerador inteligente</h2>
      <p className="mb-4 text-sm text-slate-400">
        Descreva a tabela ou a API que você precisa. O portal devolve schema Prisma, rotas CRUD,
        tipos, SQL e client — é só copiar.
      </p>

      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder="ex: tabela de produtos com nome, preco, estoque"
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400/60"
        />
        <button
          onClick={() => run()}
          disabled={loading}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Gerar"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <button
            key={e}
            onClick={() => run(e)}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:border-violet-400/50 hover:text-white"
          >
            {e}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-emerald-400">{result.summary}</p>
          {result.blocks.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <span className="font-mono text-xs text-slate-400">{b.title}</span>
                <button
                  onClick={() => copy(b)}
                  className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white transition hover:bg-white/20"
                >
                  {copied === b.id ? "copiado ✓" : "copiar"}
                </button>
              </div>
              <pre className="max-h-80 overflow-auto p-3 font-mono text-xs leading-relaxed text-slate-200">
                {b.code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}