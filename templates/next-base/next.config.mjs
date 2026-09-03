/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite rodar o app (3000) e o Portal (4100) ao mesmo tempo,
  // cada um com sua própria pasta de build.
  distDir: process.env.GBIT_DIST_DIR || ".next",
  reactStrictMode: true,

  // Pacotes que só rodam no Node (nunca devem entrar no bundle do browser).
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "bcryptjs",
    "jsonwebtoken",
    "mercadopago",
    "express",
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Evita "UnhandledSchemeError: Reading from node:async_hooks ..."
      // quando um módulo de servidor é alcançado pelo grafo do client.
      const nodeOnly = [
        "async_hooks",
        "fs",
        "fs/promises",
        "net",
        "tls",
        "dns",
        "child_process",
        "worker_threads",
        "perf_hooks",
      ];

      config.resolve.alias = { ...(config.resolve.alias || {}) };
      config.resolve.fallback = { ...(config.resolve.fallback || {}) };

      for (const mod of nodeOnly) {
        config.resolve.alias[`node:${mod}`] = false;
        config.resolve.fallback[mod] = false;
      }
    }
    return config;
  },
};

export default nextConfig;