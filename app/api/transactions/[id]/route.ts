import { NextResponse } from "next/server";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await new Promise((r) => setTimeout(r, 200));
  const { id } = await params;
  const transaction = MOCK_TRANSACTIONS.find((t) => t.id === id);

  if (!transaction) {
    return NextResponse.json(
      { message: "Transaction not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: transaction });
}
