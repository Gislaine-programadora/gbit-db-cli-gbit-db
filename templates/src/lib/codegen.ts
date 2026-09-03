/**
 * GBIT Codegen — o "cérebro" do Portal.
 * Interpreta um pedido em linguagem natural e devolve código pronto:
 * modelo Prisma, rota CRUD Next.js, tipos TS, SQL e cliente fetch.
 */

export type CodeBlock = { id: string; title: string; language: string; code: string };
export type CodegenResult = {
  entity: string;
  fields: Field[];
  summary: string;
  blocks: CodeBlock[];
};

export type Field = { name: string; prisma: string; ts: string; sql: string; optional: boolean };

const TYPE_HINTS: { match: RegExp; prisma: string; ts: string; sql: string }[] = [
  { match: /(email|e-mail)/i, prisma: "String", ts: "string", sql: "TEXT" },
  { match: /(senha|password|hash|token|slug|url|link|imagem|image|foto|avatar|descri|titulo|título|nome|name|telefone|phone|cpf|cnpj|endereco|endereço|cep|cidade|estado|status|categoria|tipo)/i, prisma: "String", ts: "string", sql: "TEXT" },
  { match: /(preco|preço|price|valor|amount|total|nota|rating|peso)/i, prisma: "Float", ts: "number", sql: "DOUBLE PRECISION" },
  { match: /(quantidade|qtd|estoque|stock|idade|age|count|numero|número|ordem)/i, prisma: "Int", ts: "number", sql: "INTEGER" },
  { match: /(ativo|active|publicado|published|pago|paid|admin|is[A-Z])/i, prisma: "Boolean", ts: "boolean", sql: "BOOLEAN" },
  { match: /(data|date|_at|nascimento|vencimento|expira)/i, prisma: "DateTime", ts: "Date", sql: "TIMESTAMP" },
];

const STOP = new Set([
  "uma","um","de","do","da","com","para","tabela","table","crie","criar","cria","gera","gerar","gere",
  "api","rota","rotas","endpoint","endpoints","campos","campo","e","o","a","os","as","que","tem","ter",
  "quero","preciso","por","favor","no","na","backend","prisma","model","modelo","crud","banco","dados",
]);

function pascal(word: string) {
  return word
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + (/[A-Z]/.test(w.slice(1)) ? w.slice(1) : w.slice(1).toLowerCase()))
    .join("");
}

function camel(word: string) {
  const p = pascal(word);
  return p[0]?.toLowerCase() + p.slice(1);
}

function singular(word: string) {
  if (/(oes|ões)$/i.test(word)) return word.replace(/(oes|ões)$/i, "ao");
  if (/ns$/i.test(word)) return word.replace(/ns$/i, "m");
  if (/is$/i.test(word)) return word.replace(/is$/i, "l");
  if (/s$/i.test(word) && word.length > 3) return word.slice(0, -1);
  return word;
}

function typeOf(name: string) {
  for (const hint of TYPE_HINTS) if (hint.match.test(name)) return hint;
  return { prisma: "String", ts: "string", sql: "TEXT" };
}

export function parsePrompt(prompt: string): { entity: string; fields: Field[] } {
  const text = prompt.trim();

  // 1) entidade: "tabela de produtos", "model Product", "crie clientes"
  const explicit =
    text.match(/tabela\s+(?:de\s+)?([a-zA-ZÀ-ÿ_]+)/i) ||
    text.match(/model[o]?\s+([a-zA-Z_]+)/i) ||
    text.match(/(?:crud|api)\s+(?:de\s+|para\s+)?([a-zA-ZÀ-ÿ_]+)/i);

  let entityWord = explicit?.[1];
  if (!entityWord) {
    entityWord = text
      .split(/[\s,.:]+/)
      .map((w) => w.toLowerCase())
      .find((w) => w.length > 2 && !STOP.has(w));
  }
  const entity = pascal(singular(entityWord || "Item"));

  // 2) campos: tudo depois de "com", "campos", ":" ou lista separada por vírgula
  const fieldsPart =
    text
      .split(/\bcampos?\b\s*:?\s*|\bcom\b\s+(?:os\s+)?(?:campos?\s*:?\s*)?|:\s*/i)
      .slice(1)
      .join(" ") || (text.includes(",") ? text.split(/,(.+)/)[1] : "");


  const raw = fieldsPart
    .split(/[,;]|\se\s|\+/)
    .map((f) => f.trim())
    .filter(Boolean);

  const fields: Field[] = [];
  const seen = new Set<string>();

  for (const item of raw) {
    const word = item.split(/\s+/)[0];
    const name = camel(word);
    if (!name || name.length < 2 || STOP.has(name.toLowerCase()) || seen.has(name)) continue;
    seen.add(name);
    const t = typeOf(item);
    fields.push({
      name,
      prisma: t.prisma,
      ts: t.ts,
      sql: t.sql,
      optional: /opcional|optional|\?/i.test(item),
    });
  }

  if (!fields.length) {
    fields.push(
      { name: "name", prisma: "String", ts: "string", sql: "TEXT", optional: false },
      { name: "description", prisma: "String", ts: "string", sql: "TEXT", optional: true },
    );
  }

  return { entity, fields };
}

export function generate(prompt: string): CodegenResult {
  const { entity, fields } = parsePrompt(prompt);
  const lower = camel(entity);
  const plural = `${lower}s`;
  const pad = Math.max(...fields.map((f) => f.name.length), 9) + 2;

  const prismaModel = `model ${entity} {
  id        String   @id @default(uuid())
${fields
  .map((f) => `  ${f.name.padEnd(pad)}${f.prisma}${f.optional ? "?" : ""}`)
  .join("\n")}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;

  const tsType = `export type ${entity} = {
  id: string;
${fields.map((f) => `  ${f.name}${f.optional ? "?" : ""}: ${f.ts};`).join("\n")}
  createdAt: Date;
  updatedAt: Date;
};`;

  const apiRoute = `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/${plural}
export async function GET() {
  const items = await prisma.${lower}.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

// POST /api/${plural}
export async function POST(request: Request) {
  const body = await request.json();

${fields
  .filter((f) => !f.optional)
  .map(
    (f) =>
      `  if (body.${f.name} === undefined) {\n    return NextResponse.json({ error: "${f.name} é obrigatório" }, { status: 400 });\n  }`,
  )
  .join("\n")}

  const created = await prisma.${lower}.create({
    data: {
${fields.map((f) => `      ${f.name}: body.${f.name},`).join("\n")}
    },
  });

  return NextResponse.json(created, { status: 201 });
}`;

  const apiItemRoute = `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const item = await prisma.${lower}.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const updated = await prisma.${lower}.update({ where: { id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.${lower}.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}`;

  const sql = `CREATE TABLE "${plural}" (
  "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
${fields
  .map((f) => `  "${f.name}"${" ".repeat(Math.max(pad - f.name.length, 1))}${f.sql}${f.optional ? "" : " NOT NULL"},`)
  .join("\n")}
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);`;

  const client = `export async function list${entity}s() {
  const res = await fetch("/api/${plural}", { cache: "no-store" });
  return res.json();
}

export async function create${entity}(data: {
${fields.map((f) => `  ${f.name}${f.optional ? "?" : ""}: ${f.ts};`).join("\n")}
}) {
  const res = await fetch("/api/${plural}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao criar ${lower}");
  return res.json();
}`;

  const seed = `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

await prisma.${lower}.createMany({
  data: [
    {
${fields.map((f) => `      ${f.name}: ${exampleValue(f)},`).join("\n")}
    },
  ],
});

await prisma.$disconnect();`;

  return {
    entity,
    fields,
    summary: `Gerei o CRUD completo de ${entity} com ${fields.length} campo(s): ${fields
      .map((f) => f.name)
      .join(", ")}.`,
    blocks: [
      { id: "prisma", title: "prisma/schema.prisma", language: "prisma", code: prismaModel },
      { id: "route", title: `src/app/api/${plural}/route.ts`, language: "ts", code: apiRoute },
      { id: "route-id", title: `src/app/api/${plural}/[id]/route.ts`, language: "ts", code: apiItemRoute },
      { id: "type", title: `src/types/${lower}.ts`, language: "ts", code: tsType },
      { id: "client", title: `src/lib/${lower}-client.ts`, language: "ts", code: client },
      { id: "sql", title: "SQL", language: "sql", code: sql },
      { id: "seed", title: "prisma/seed (trecho)", language: "ts", code: seed },
    ],
  };
}

function exampleValue(f: Field) {
  if (f.ts === "number") return "10";
  if (f.ts === "boolean") return "true";
  if (f.ts === "Date") return "new Date()";
  if (/email/i.test(f.name)) return '"user@gbit.dev"';
  return `"exemplo de ${f.name}"`;
}