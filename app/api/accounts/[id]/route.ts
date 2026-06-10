import { NextResponse } from "next/server";
import { MOCK_ACCOUNTS } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await new Promise((r) => setTimeout(r, 200));
  const { id } = await params;
  const account = MOCK_ACCOUNTS.find((a) => a.id === id);

  if (!account) {
    return NextResponse.json({ message: "Account not found" }, { status: 404 });
  }

  return NextResponse.json({ data: account });
}
