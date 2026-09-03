"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; name: string; email: string; role: string };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixError, setPixError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("gbit_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else router.push("/login");
      });
  }, [router]);

  async function handlePix() {
    setLoadingPix(true);
    setPixError("");
    setQrCode(null);

    const token = localStorage.getItem("gbit_token");
    const res = await fetch("/api/payments/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount: 1, description: "Teste gbit-db" }),
    });
    const data = await res.json();

    if (!res.ok) {
      setPixError(data.error || "Erro ao gerar Pix.");
    } else {
      setQrCode(data.qrCodeBase64);
    }
    setLoadingPix(false);
  }

  function handleLogout() {
    localStorage.removeItem("gbit_token");
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Olá, {user.name} 👋</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-900">
            Sair
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Testar pagamento Pix</h2>
          <button
            onClick={handlePix}
            disabled={loadingPix}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loadingPix ? "Gerando..." : "Gerar Pix de teste (R$ 1,00)"}
          </button>

          {pixError && <p className="mt-3 text-sm text-red-600">{pixError}</p>}

          {qrCode && (
            <img
              src={`data:image/png;base64,${qrCode}`}
              alt="QR Code Pix"
              className="mt-4 h-48 w-48"
            />
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Gerado com gbit-db — troque esta página em src/app/dashboard/page.tsx
        </p>
      </div>
    </div>
  );
}