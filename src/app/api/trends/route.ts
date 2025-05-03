/**
 * @file API route to fetch web trends.
 */
import { NextResponse } from "next/server";
import { fetchTwitterTrends } from "@/lib/trends";
import { normalizeTrendScores } from "@/lib/utils";

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

    // Normalize scores to ensure they sum to 100%.
    const normalizedTrends = normalizeTrendScores(trends);

    return NextResponse.json(
      { trends: normalizedTrends },
      {
        headers: {
          "Cache-Control": "public, max-age=600, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
