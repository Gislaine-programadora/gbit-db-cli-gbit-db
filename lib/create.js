import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { banner, spinner, box, rule, c } from "./ui.js";
import { openTerminal } from "./terminal.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesRoot = path.join(__dirname, "..", "templates");

// Função de cópia ultrarrápida com filtro ajustado
function copyFolder(name, destination) {
  const source = path.join(templatesRoot, name);
  if (!fs.existsSync(source)) return;

  fs.cpSync(source, destination, {
    recursive: true,
    force: true,
    dereference: true,
    filter: (src) => {
      const normalized = src.replace(/\\/g, "/");
      // PERMITE copiar node_modules se existir no template, bloqueia apenas caches pesados
      return !(
        normalized.includes("/.next/") ||
        normalized.includes("/.git/") ||
        normalized.includes("/dist/")
      );
    },
  });
}

function copyFile(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function removePath(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
}

function cleanAndPreparePackage(root, projectName) {
  const pkgPath = path.join(root, "package.json");
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const removedPackages = [
    "prisma",
    "@prisma/client",
    "@prisma/adapter-pg",
    "@prisma/adapter-better-sqlite3",
    "pg",
    "pg-hstore",
    "postgres",
    "@types/pg",
  ];

  for (const section of ["dependencies", "devDependencies", "optionalDependencies"]) {
    if (!pkg[section]) continue;
    for (const name of removedPackages) {
      delete pkg[section][name];
    }
  }

  if (pkg.scripts) {
    for (const key of Object.keys(pkg.scripts)) {
      if (
        key.includes("prisma") ||
        key.includes("db:migrate") ||
        key.includes("db:seed") ||
        key.includes("db:studio")
      ) {
        delete pkg.scripts[key];
      }
    }
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

function removePrismaFiles(root) {
  removePath(path.join(root, "prisma"));
  removePath(path.join(root, "prisma-seed"));
  removePath(path.join(root, "prisma.config.ts"));

  for (const file of ["schema.prisma", "seed.ts", "seed.js"]) {
    const target = path.join(root, file);
    if (fs.existsSync(target)) fs.rmSync(target, { force: true });
  }

  for (const envFile of [".env", ".env.example"]) {
    const envPath = path.join(root, envFile);
    if (!fs.existsSync(envPath)) continue;

    const cleaned = fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .filter((line) => !/^\s*(DATABASE_URL|POSTGRES_|PG_)/i.test(line))
      .join("\n");

    fs.writeFileSync(envPath, cleaned);
  }
}

export default async function createProject(argv = process.argv.slice(2)) {
  const args = argv.filter((a) => !a.startsWith("-"));
  const flags = argv.filter((a) => a.startsWith("-"));

  const projectName = args[0];
  const skipInstall = flags.includes("--no-install");
  const autoOpen = flags.includes("--open");

  banner();

  if (!projectName) {
    console.log("  " + c.red("✖ Informe o nome do projeto."));
    console.log("");
    console.log("  " + c.yellow("Uso:") + " gbit-db meu-projeto [--no-install] [--open]");
    console.log("");
    return;
  }

  const root = path.join(process.cwd(), projectName);

  if (fs.existsSync(root)) {
    console.log("  " + c.red(`✖ A pasta "${projectName}" já existe.\n`));
    process.exitCode = 1;
    return;
  }

  const t0 = Date.now();

  rule("criando " + c.cyan(projectName));
  console.log("");

  try {
    // 1. NEXT.JS BASE
    let s = spinner("Montando projeto Next.js");

    copyFolder("next-base", root);
    cleanAndPreparePackage(root, projectName);

    const gitignore = path.join(root, "gitignore");
    const dotGitignore = path.join(root, ".gitignore");
    if (fs.existsSync(gitignore) && !fs.existsSync(dotGitignore)) {
      fs.renameSync(gitignore, dotGitignore);
    }

    s.succeed("Next.js 15 + TypeScript + Tailwind");

    // 2. GBIT MODULES
    s = spinner("Integrando gbit-db-dados");

    copyFolder("src", path.join(root, "src"));
    copyFolder("gbit-container", path.join(root, "gbit-container"));
    copyFolder("gbit-database", path.join(root, "gbit-database"));
    copyFolder("gbit-db-dados", path.join(root, "gbit-db-dados"));
    copyFolder("scripts", path.join(root, "scripts"));

    copyFile(path.join(templatesRoot, "gbit-container.json"), path.join(root, "gbit-container.json"));
    copyFile(path.join(templatesRoot, "env.example"), path.join(root, ".env"));
    copyFile(path.join(templatesRoot, "env.example"), path.join(root, ".env.example"));

    removePrismaFiles(root);

    s.succeed("gbit-db-dados · GBIT Container · Portal");

    // 3. INSTALAÇÃO (Verifica se node_modules já foi copiado)
    const hasNodeModules = fs.existsSync(path.join(root, "node_modules"));

    if (skipInstall) {
      console.log("  " + c.gray("• instalação pulada (--no-install)"));
    } else if (hasNodeModules) {
      s = spinner("Instalando dependências");
      s.succeed("Dependências vinculadas via template local");
    } else {
      s = spinner("Instalando dependências");

      // Usando npm ci com flags de cache estrito se o lockfile existir
      const hasLock = fs.existsSync(path.join(root, "package-lock.json"));
      const fastFlags = "--offline --prefer-offline --no-audit --no-fund --loglevel=error";
      const cmd = hasLock ? `npm ci ${fastFlags}` : `npm install ${fastFlags}`;

      try {
        execSync(cmd, { cwd: root, stdio: ["ignore", "ignore", "pipe"] });
      } catch {
        execSync(`npm install --prefer-offline --no-audit --no-fund --loglevel=error`, {
          cwd: root,
          stdio: ["ignore", "ignore", "pipe"],
        });
      }

      s.succeed("Dependências instaladas");
    }

    // 4. CARD FINAL
    const secs = ((Date.now() - t0) / 1000).toFixed(1);

    console.log("");

    box(`✔ PROJETO CRIADO EM ${secs}s`, [
      c.gray("pasta      ") + c.cyan(projectName),
      "",
      c.gray("App        ") + c.cyan("http://localhost:3000"),
      c.gray("Database   ") + c.cyan("http://localhost:4200"),
      c.gray("Portal/AI  ") + c.cyan("http://localhost:4100/portal"),
      c.gray("Container  ") + c.cyan("http://localhost:4300"),
      "",
      c.gray("cd ") + c.cyan(projectName) + c.gray("  &&  npm run dev"),
      "",
      c.white("Banco  ") + c.cyan("gbit-db-dados") + c.gray(" — zero deps, 100% arquivos locais"),
    ]);

    console.log("");

    // 5. --open
    if (autoOpen) {
      console.log("  " + c.gray("abrindo terminais..."));

      openTerminal({
        title: "GBIT · App",
        command: "npm run dev",
        cwd: root,
      });

      openTerminal({
        title: "GBIT · Portal",
        command: "npm run portal",
        cwd: root,
      });

      openTerminal({
        title: "GBIT · Container",
        command: "gbit-container run --watch",
        cwd: root,
      });

      console.log("");
    }
  } catch (error) {
    console.log("");
    console.log("  " + c.red.bold("✖ Erro ao criar o projeto."));
    console.log("  " + c.red(error.stderr?.toString?.() || error.message || String(error)));
    console.log("");

    process.exitCode = 1;
  }
}