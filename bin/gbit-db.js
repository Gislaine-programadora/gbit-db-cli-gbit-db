#!/usr/bin/env node
import createProject from "../lib/create.js";
import { banner, rule, c } from "../lib/ui.js";
import { openTerminal } from "../lib/terminal.js";

const [, , first, ...rest] = process.argv;

function help() {
  banner();
  rule("comandos");
  const rows = [
    ["gbit-db <nome>", "cria o projeto completo (Next + Prisma + GBIT)"],
    ["gbit-db <nome> --open", "cria e já abre os 3 terminais"],
    ["gbit-db <nome> --no-install", "cria sem instalar dependências"],
    ["gbit-db up", "abre app + portal + container em terminais separados"],
    ["gbit-db help", "esta ajuda"],
  ];
  console.log("");
  rows.forEach(([cmd, desc]) => console.log(`    ${c.cyan(cmd.padEnd(30))} ${c.gray(desc)}`));
  console.log("");
  rule("urls");
  console.log("");
  console.log(`    ${c.gray("app        ")}${c.cyan("http://localhost:3000")}`);
  console.log(`    ${c.gray("portal     ")}${c.cyan("http://localhost:4100/portal")}`);
  console.log(`    ${c.gray("container  ")}${c.cyan("http://localhost:4300")}`);
  console.log("");
}

async function main() {
  if (!first || first === "help" || first === "--help" || first === "-h") return help();

  if (first === "up") {
    banner("subindo o ambiente");
    const targets = [
      ["GBIT · App", "npm run dev", "http://localhost:3000"],
      ["GBIT · Portal", "npm run portal", "http://localhost:4100/portal"],
      ["GBIT · Container", "npm run container -- run --watch", "http://localhost:4300"],
    ];
    for (const [title, command, url] of targets) {
      openTerminal({ title, command });
      console.log(`  ${c.green("▸")} ${title.padEnd(20)} ${c.cyan(url)}`);
    }
    console.log("");
    return;
  }

  if (first === "create" || first === "new") return createProject(rest);

  return createProject([first, ...rest]);
}

main();