import { NextResponse } from "next/server";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";

export async function GET(request: Request) {
  await new Promise((r) => setTimeout(r, 400));

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "all";
  const sortBy = searchParams.get("sortBy") ?? "date";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  let results = [...MOCK_TRANSACTIONS];

  if (type && type !== "all") {
    results = results.filter((t) => t.type === type);
  }

  if (dateFrom) {
    results = results.filter((t) => new Date(t.date) >= new Date(dateFrom));
  }

  if (dateTo) {
    results = results.filter((t) => new Date(t.date) <= new Date(dateTo));
  }

  results.sort((a, b) => {
    if (sortBy === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    return sortOrder === "asc"
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = results.slice(start, start + limit);

  return NextResponse.json({ data, total, page, limit, totalPages });
}
