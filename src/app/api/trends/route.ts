/**
 * @file API route to fetch web trends.
 */
import { NextResponse } from "next/server";
import { fetchTwitterTrends } from "@/lib/trends";
import { normalizeTrendScores } from "@/lib/utils";

export const revalidate = parseInt(
  process.env.TRENDS_SHARED_CACHE_MAXAGE || "3600",
  10
); // 1 hour

/**
 * Retrieve keyword list of current trends from the web.
 */
export async function GET() {
  try {
    const trends = await fetchTwitterTrends();

    if (!trends?.length) {
      return NextResponse.json(
        { error: "No trends data available" },
        { status: 400 }
      );
    }

    const normalizedTrends = normalizeTrendScores(trends);
    return NextResponse.json({ trends: normalizedTrends });
  } catch (error) {
    console.error("Error fetching trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
