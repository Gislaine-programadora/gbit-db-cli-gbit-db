import { NextResponse } from "next/server";
import { generate } from "@/lib/codegen";

export async function POST(request: Request) {
  const { prompt } = (await request.json()) as { prompt?: string };

  if (!prompt || prompt.trim().length < 3) {
    return NextResponse.json({ error: "Descreva o que você quer gerar." }, { status: 400 });
  }

  const result = generate(prompt);
  return NextResponse.json(result);
}