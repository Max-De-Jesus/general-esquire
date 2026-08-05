import { NextResponse } from "next/server";
import initialNews from "@/data/news_store.json";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ success: true, news: initialNews });
}
