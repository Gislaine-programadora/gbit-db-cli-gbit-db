"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("gbit_token");
        const role = localStorage.getItem("gbit_role");

        if (!token) {
          router.push("/login");
          return;
        }

        if (role !== "ADMIN") {
          router.push("/dashboard");
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Não foi possível carregar o usuário.");
        }

        if (!data.user) {
          throw new Error("Usuário não encontrado.");
        }

        if (data.user.role !== "ADMIN") {
          router.push("/dashboard");
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("Erro ao carregar Admin:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar o painel administrativo."
        );
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p>Carregando painel administrativo...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="w-full max-w-md rounded-xl border border-red-900 bg-gray-900 p-6">
          <h1 className="text-xl font-semibold">
            Erro no painel administrativo
          </h1>

          <p className="mt-3 text-sm text-red-400">
            {error}
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black"
          >
            Voltar para Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">GBIT Backend</p>

            <h1 className="mt-2 text-3xl font-bold">
              Painel Admin
            </h1>

            <p className="mt-2 text-gray-400">
              Logado como{" "}
              <span className="font-medium text-white">
                {user.name}
              </span>{" "}
              ({user.role})
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:bg-gray-900"
          >
            Dashboard
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Usuário
            </p>

            <p className="mt-2 text-lg font-semibold">
              {user.name}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Email
            </p>

            <p className="mt-2 break-all text-sm">
              {user.email}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Permissão
            </p>

            <p className="mt-2 font-semibold text-green-400">
              {user.role}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold">
            Administração
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Área administrativa do GBIT Backend.
          </p>

          <p className="mt-4 text-sm text-gray-400">
            Gerado com{" "}
            <span className="font-medium text-white">
              gbit-db
            </span>
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Confira também o{" "}
            <a
              href="/portal"
              className="text-white underline"
            >
              Portal GBIT
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}