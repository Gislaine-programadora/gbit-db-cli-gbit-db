#!/usr/bin/env node
import { spawn } from "node:child_process";

const PORT = process.env.GBIT_PORTAL_PORT || "4100";
const url = `http://localhost:${PORT}/portal`;

console.log("");
console.log("  \x1b[45m\x1b[97m GBIT PORTAL \x1b[0m  ferramenta de endpoints + IA de código");
console.log(`  \x1b[36m${url}\x1b[0m`);
console.log("");

const child = spawn("npx", ["next", "dev", "-p", PORT], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, GBIT_DIST_DIR: ".next-portal", GBIT_SURFACE: "portal" },
});

child.on("exit", (code) => process.exit(code ?? 0));