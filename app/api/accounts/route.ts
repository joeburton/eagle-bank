import { NextResponse } from "next/server";
import { MOCK_ACCOUNTS } from "@/lib/mock-data";

export async function GET() {
  await new Promise((r) => setTimeout(r, 300));
  return NextResponse.json({ data: MOCK_ACCOUNTS });
}
