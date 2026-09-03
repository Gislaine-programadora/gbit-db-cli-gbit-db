import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const gbit = require("gbit-db-dados");

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token não fornecido." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido ou expirado." },
        { status: 401 }
      );
    }

    const db = gbit.open("./gbit-db-dados");
    const users = db.collection("users");

    const user = users.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user._createdAt,
      },
    });
  } catch (error) {
    console.error("Erro em /api/auth/me:", error);

    return NextResponse.json(
      { error: "Erro ao consultar usuário." },
      { status: 500 }
    );
  }
}

