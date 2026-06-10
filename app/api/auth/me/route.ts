import { NextResponse } from "next/server";
import { MOCK_USERS, MOCK_TOKEN } from "@/lib/mock-data";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== MOCK_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ data: MOCK_USERS[0] });
}
