/**
 * @file API route to generate an animation prompt based on user-provided trends.
 */
import { NextResponse } from "next/server";
import { generateAnimationPrompt } from "@/lib/prompt";
import { normalizeTrendScores } from "@/lib/utils";

/**
 * Validate the trends array to ensure it matches the expected format.
 * @param trends - The trends array to validate.
 * @returns True if valid, false otherwise.
 */
function validateTrends(
  trends: unknown
): trends is { trend: string; score?: number }[] {
  return (
    Array.isArray(trends) &&
    trends.every(
      (trend) =>
        typeof trend === "object" &&
        trend !== null &&
        typeof trend.trend === "string" &&
        (trend.score === undefined || typeof trend.score === "number")
    )
  );
}

/**
 * Generate an AI animation prompt based on user-provided trends.
 */
export async function POST(request: Request) {
  try {
    const { trends } = await request.json();

    if (!validateTrends(trends)) {
      return NextResponse.json(
        {
          error: `Invalid or missing 'trends'. Each trend must have a 'trend' (string) 
          and an optional 'score' (number).
          `,
        },
        { status: 400 }
      );
    }

    const normalizedTrends = normalizeTrendScores(
      trends.map((trend) => ({
        trend: trend.trend,
        score: trend.score ?? 0,
      }))
    );

    // Generate prompt and create Daydream URL.
    const prompt = await generateAnimationPrompt(normalizedTrends);
    const daydreamUrl = `https://daydream.live/create?inputPrompt=${
      encodeURIComponent(prompt)
    }`;

    return NextResponse.json({ prompt, daydreamUrl });
  } catch (error) {
    console.error("Error generating animation prompt:", error);
    return NextResponse.json(
      { error: "Failed to generate animation prompt" },
      { status: 500 }
    );
  }
}
