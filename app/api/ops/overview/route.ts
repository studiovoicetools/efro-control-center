import { NextResponse } from "next/server";
import { getOverviewData } from "@/lib/ops-data";

export async function GET() {
  const data = await getOverviewData();
  return NextResponse.json(data);
}
