#!/usr/bin/env node
import { openTerminal } from "./lib/terminal.mjs";

const cwd = process.cwd();

const targets = [
  { title: "GBIT · App", command: "npm run dev", url: "http://localhost:3000" },
  { title: "GBIT · Portal", command: "npm run portal", url: "http://localhost:4100/portal" },
  {
    title: "GBIT · Container",
    command: "npm run container -- run --watch",
    url: "http://localhost:4300",
  },
];

console.log("");
console.log("  \x1b[45m\x1b[97m GBIT UP \x1b[0m abrindo 3 terminais separados\n");

for (const t of targets) {
  openTerminal({ title: t.title, command: t.command, cwd });
  console.log(`  \x1b[32m▸\x1b[0m ${t.title.padEnd(18)} \x1b[36m${t.url}\x1b[0m`);
}

console.log("");
console.log("  Se a janela não abrir automaticamente, rode cada comando manualmente:");
targets.forEach((t) => console.log(`    ${t.command}`));
console.log("");