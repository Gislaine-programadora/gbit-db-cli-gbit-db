"use client";

import { useState } from "react";

type HeaderRow = { key: string; value: string };

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export default function RequestClient() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("/api/health");
  const [headers, setHeaders] = useState<HeaderRow[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    time: number;
    body: string;
  } | null>(null);
  const [error, setError] = useState("");

  function updateHeader(index: number, field: "key" | "value", value: string) {
    const next = [...headers];
    next[index][field] = value;
    setHeaders(next);
  }

  function addHeaderRow() {
    setHeaders([...headers, { key: "", value: "" }]);
  }

  function removeHeaderRow(index: number) {
    setHeaders(headers.filter((_, i) => i !== index));
  }

  async function handleSend() {
    setLoading(true);
    setError("");
    setResponse(null);

    const headersObj: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key) headersObj[h.key] = h.value;
    });

    const start = performance.now();

    try {
      const res = await fetch(url, {
        method,
        headers: headersObj,
        body: ["GET", "DELETE"].includes(method) ? undefined : body || undefined,
      });

      const time = Math.round(performance.now() - start);
      const text = await res.text();

      let formatted = text;
      try {
        formatted = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // não é JSON, mantém texto puro
      }

      setResponse({ status: res.status, time, body: formatted });
    } catch {
      setError("Não foi possível completar a requisição. Confira a URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-lg font-semibold text-white">Cliente HTTP</h2>
      <p className="mb-4 text-sm text-slate-400">Teste qualquer rota da sua API, sem sair do projeto.</p>

      <div className="mb-3 flex gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-2 text-sm font-medium text-white outline-none"
        >
          {METHODS.map((m) => (
            <option key={m} value={m} className="bg-[#0b1020]">{m}</option>
          ))}
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/api/health ou https://..."
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400/60"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-xs font-medium text-slate-400">Headers</p>
        {headers.map((h, i) => (
          <div key={i} className="mb-1.5 flex gap-2">
            <input
              value={h.key}
              onChange={(e) => updateHeader(i, "key", e.target.value)}
              placeholder="Authorization"
              className="flex-1 rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-white outline-none placeholder:text-slate-500"
            />
            <input
              value={h.value}
              onChange={(e) => updateHeader(i, "value", e.target.value)}
              placeholder="Bearer ..."
              className="flex-1 rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-white outline-none placeholder:text-slate-500"
            />
            <button onClick={() => removeHeaderRow(i)} className="px-2 text-xs text-slate-500 hover:text-red-400">
              ✕
            </button>
          </div>
        ))}
        <button onClick={addHeaderRow} className="text-xs font-medium text-slate-400 hover:text-white">
          + adicionar header
        </button>
      </div>

      {!["GET", "DELETE"].includes(method) && (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='{ "email": "admin@gbit.dev", "password": "admin123" }'
          rows={4}
          className="mb-3 rounded-lg border border-white/10 bg-black/30 p-2.5 font-mono text-xs text-white outline-none placeholder:text-slate-500"
        />
      )}

      <div className="flex-1 overflow-hidden rounded-lg border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-3 py-2 text-xs">
          <span className="font-medium text-slate-400">Resposta</span>
          {response && (
            <span
              className={`font-mono font-semibold ${
                response.status < 300 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {response.status} · {response.time}ms
            </span>
          )}
        </div>
        <pre className="h-full max-h-64 overflow-auto bg-black/40 p-4 text-xs text-slate-200">
          <code>
            {error
              ? error
              : response
              ? response.body
              : "A resposta aparece aqui depois de enviar."}
          </code>
        </pre>
      </div>
    </div>
  );
}
