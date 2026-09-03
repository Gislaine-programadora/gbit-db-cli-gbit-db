import Link from "next/link";

const links = [
  { href: "/login", label: "Login", desc: "Autenticação JWT pronta" },
  { href: "/dashboard", label: "Dashboard", desc: "Área do usuário" },
  { href: "/admin", label: "Admin", desc: "Gestão e métricas" },
  { href: "/portal", label: "Portal", desc: "HTTP client + IA de código" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b1020] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <span className="rounded-full bg-violet-600/20 px-3 py-1 text-xs font-medium text-violet-300">
          GBIT Container Engine
        </span>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Seu backend está no ar</h1>
        <p className="mt-3 text-slate-400">
          Next.js + Prisma + Database GBIT + Container Engine, sem Docker.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-violet-400/50 hover:bg-white/10"
            >
              <p className="font-medium">{l.label}</p>
              <p className="text-sm text-slate-400">{l.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm text-slate-300">
          <p>npm run gbit:up · sobe app + portal + container</p>
          <p className="text-slate-500">portal → http://localhost:4100/portal</p>
          <p className="text-slate-500">container → http://localhost:4300</p>
        </div>
      </div>
    </main>
  );
}