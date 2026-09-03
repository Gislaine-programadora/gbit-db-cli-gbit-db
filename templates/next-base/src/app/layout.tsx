import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GBIT App",
  description: "Backend completo gerado pelo GBIT DB CLI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}