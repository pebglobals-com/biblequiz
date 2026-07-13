import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const age = req.nextUrl.searchParams.get("age") || undefined;
  const sermons = db.sermons.getAll(age);
  const stats = db.stats.getCounts();
  return NextResponse.json({ sermons, stats });
}
