/**
 * @file Utility functions for the application.
 */

import { Trend } from "@/types";

/**
 * Normalize the trend scores so that the sum of all scores equals 100%.
 * If a trend's score is missing or zero, it defaults to 1.
 *
 * @param trends - Array of trend entries.
 * @returns Array of trend entries with normalized scores.
 */
export const normalizeTrendScores = (trends: Trend[]) => {
  // Assign default scores and calculate the total score in one step.
  const totalScore = trends.reduce(
    (sum, t) => sum + (t.score > 0 ? t.score : 1),
    0
  );

  // Normalize scores.
  return trends.map((t) => ({
    ...t,
    score: ((t.score > 0 ? t.score : 1) / totalScore) * 100,
  }));
};
