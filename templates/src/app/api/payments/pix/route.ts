import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { verifyToken } from "@/lib/auth";

const gbit = require("gbit-db-dados");

export async function POST(request: Request) {
  try {
    // =========================
    // 1. AUTENTICAÇÃO
    // =========================

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

    // =========================
    // 2. DADOS DO PAGAMENTO
    // =========================

    const body = await request.json();

    const amount = Number(body.amount) || 1;

    const description =
      body.description || "Pagamento via gbit-db";

    // =========================
    // 3. MERCADO PAGO
    // =========================

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken || accessToken.includes("COLOQUE_SEU")) {
      return NextResponse.json(
        {
          error:
            "MERCADOPAGO_ACCESS_TOKEN não configurado no .env",
        },
        { status: 500 }
      );
    }

    const client = new MercadoPagoConfig({
      accessToken,
    });

    const mpPayment = new Payment(client);

    const result = await mpPayment.create({
      body: {
        transaction_amount: amount,
        description,
        payment_method_id: "pix",
        payer: {
          email: "comprador@example.com",
        },
      },
    });

    // =========================
    // 4. BANCO GBIT
    // =========================

    const db = gbit.open("./gbit-db-dados");

    // Cria a coleção caso ainda não exista
    const collections = db.listCollections();

    if (!collections.includes("payments")) {
      db.createCollection("payments");
    }

    const payments = db.collection("payments");

    const payment = payments.insert({
      userId: payload.userId,
      amount,
      description,
      status: result.status || "pending",
      provider: "mercadopago",
      externalId: String(result.id),
      paymentMethod: "pix",
      createdAt: new Date().toISOString(),
    });

    // =========================
    // 5. RESPOSTA
    // =========================

    return NextResponse.json({
      success: true,

      paymentId: result.id,

      databaseId: payment?._id,

      qrCode:
        result.point_of_interaction?.transaction_data?.qr_code,

      qrCodeBase64:
        result.point_of_interaction?.transaction_data
          ?.qr_code_base64,

      status: result.status,

      amount,

      description,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento Pix:", error);

    return NextResponse.json(
      {
        error: "Falha ao criar pagamento Pix.",
      },
      { status: 500 }
    );
  }
}