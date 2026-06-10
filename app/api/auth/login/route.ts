import { NextResponse } from "next/server";
import { MOCK_USERS, MOCK_TOKEN } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    await new Promise((r) => setTimeout(r, 600)); // Simulate network latency

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = MOCK_USERS.find((u) => u.email === email);

    // Mock: any password works for the demo user
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      data: { user, token: MOCK_TOKEN },
      message: "Login successful",
    });

    response.cookies.set("eagle-bank-token", MOCK_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
