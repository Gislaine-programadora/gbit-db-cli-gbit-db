import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { users } from "@/lib/gbit-db";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = users.findByIndex("email", normalizedEmail);

    if (existing) {
      return NextResponse.json(
        { error: "Este email já está em uso." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = users.insert({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "CLIENT",
    });

    const token = generateToken(user._id, user.role);

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);

    return NextResponse.json(
      { error: "Não foi possível criar a conta." },
      { status: 500 }
    );
  }
}

