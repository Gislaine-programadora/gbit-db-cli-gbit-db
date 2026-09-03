import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function getJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado no ambiente.");
  }

  return JWT_SECRET;
}

export type UserRole = "ADMIN" | "CLIENT";

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

export function generateToken(
  userId: string,
  role: UserRole | string
): string {
  const validRole: UserRole =
    role === "ADMIN" || role === "CLIENT" ? role : "CLIENT";

  return jwt.sign(
    {
      userId,
      role: validRole,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.userId !== "string" ||
      (payload.role !== "ADMIN" && payload.role !== "CLIENT")
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}