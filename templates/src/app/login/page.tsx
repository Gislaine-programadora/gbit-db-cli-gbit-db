"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Algo deu errado.");
        return;
      }

      localStorage.setItem("gbit_token", data.token);
      localStorage.setItem("gbit_role", data.user.role);
      router.push(data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          {isRegister ? "Criar conta" : "Entrar"}
        </h1>

        {isRegister && (
          <input
            className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}

        <input
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
        >
          {loading ? "Carregando..." : isRegister ? "Criar conta" : "Entrar"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="font-medium text-gray-900 hover:underline"
          >
            {isRegister ? "Entrar" : "Criar agora"}
          </button>
        </p>
      </form>
    </div>
  );
}