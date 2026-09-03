import { NextResponse } from "next/server";
import { users } from "@/lib/gbit-db";

export async function GET() {
try {
if (!users) {
throw new Error("Users collection unavailable");
}


return NextResponse.json({
  status: "ok",
  database: "connected",
  collections: ["users"],
});


} catch {
return NextResponse.json(
{
status: "error",
database: "unreachable",
},
{ status: 503 }
);
}
}
