import { NextResponse } from "next/server";
import { MOCK_TOKEN } from "@/lib/mock-data";
import type { User } from "@/types";

export async function POST(request: Request) {
  try {
    await new Promise((r) => setTimeout(r, 800));

    const body = await request.json();
    const { fullName, email, password, confirmPassword } = body;

    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      phone: "",
      address: "",
      avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      createdAt: new Date().toISOString(),
    };

    const response = NextResponse.json({
      data: { user: newUser, token: MOCK_TOKEN },
      message: "Registration successful",
    });

    response.cookies.set("eagle-bank-token", MOCK_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
