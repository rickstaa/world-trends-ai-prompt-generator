/**
 * @file API route to fetch web trends.
 */
import { NextResponse } from "next/server";
import { fetchTwitterTrends } from "@/lib/trends";
import { normalizeTrendScores } from "@/lib/utils";

// Caching values
const S_MAXAGE = parseInt(process.env.TRENDS_SHARED_CACHE_MAXAGE || "3600", 10); // 1 hour
const STALE_WHILE_REVALIDATE = 600; // 10 minutes

// ✅ Add `public` to make it cacheable by Vercel's CDN
const CACHE_HEADER = `public, s-maxage=${S_MAXAGE}, max-age=${S_MAXAGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`;

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
    return NextResponse.json(
      { trends: normalizedTrends },
      {
        status: 200,
        headers: {
          "Cache-Control": CACHE_HEADER,
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
