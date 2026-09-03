import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const clientPassword = await bcrypt.hash("cliente123", 10);

  await prisma.user.upsert({
    where: { email: "admin@gbit.dev" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gbit.dev",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "cliente@gbit.dev" },
    update: {},
    create: {
      name: "Cliente Teste",
      email: "cliente@gbit.dev",
      password: clientPassword,
      role: "CLIENT",
    },
  });

  console.log("✔ Seed concluído:");
  console.log("  Admin   → admin@gbit.dev / admin123");
  console.log("  Cliente → cliente@gbit.dev / cliente123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });