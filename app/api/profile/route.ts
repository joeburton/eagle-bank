import { NextResponse } from "next/server";
import { MOCK_USERS } from "@/lib/mock-data";

export async function GET() {
  await new Promise((r) => setTimeout(r, 200));
  return NextResponse.json({ data: MOCK_USERS[0] });
}

export async function PUT(request: Request) {
  await new Promise((r) => setTimeout(r, 500));
  const body = await request.json();
  const updated = { ...MOCK_USERS[0], ...body, id: MOCK_USERS[0].id };
  return NextResponse.json({
    data: updated,
    message: "Profile updated successfully",
  });
}
