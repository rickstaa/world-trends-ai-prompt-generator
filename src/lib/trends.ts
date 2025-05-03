/**
 * @file Utility functions for fetching and processing web trends.
 */

import { ApifyClient, PaginatedList} from "apify-client";
import { Trend } from "@/types";

if (!process.env.APIFY_API_TOKEN) {
  throw new Error("APIFY_API_TOKEN is not set in the environment variables.");
}

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN || "",
});

/** Interface representing a twitter trend entry */
interface ApifyTwitterTrend {
  /** Trend time */
  time: string;
  /** Trend time period */
  timePeriod: string;
  /** Trend name */
  trend: string;
  /** Trend tweet volume */
  volume: string;
}

/**
 * Parses the tweet volume string from the Apify dataset and converts it to a numeric
 * score.
 *
 * @param volume - The tweet volume string (e.g., "12.3K", "1M").
 * @returns The numeric score derived from the tweet volume, or 0 if parsing fails.
 */
const parseTweetVolume = (volume: string): number => {
  if (!volume || typeof volume !== "string") {
    return 0;
  }

  // Extract numeric parts from the volume string.
  const match = volume.match(/\d+/g);
  if (match) {
    return parseInt(match.join(""), 10);
  }

  return 0;
}

/**
 * Fetches Twitter trends using the Apify Twitter Trends Scraper.
 *
 * @returns A promise that resolves to an array of trend entries, sorted by score in
 * descending order.
 * @throws An error if the Apify actor call fails or if the dataset is empty.
 */
export  const fetchTwitterTrends = async (): Promise<Trend[]> =>{
  const input = {
    live: true,
    proxyOptions: {
      useApifyProxy: true,
    },
  };

  try {
    // Call the Apify actor to fetch Twitter trends.
    const run = await apifyClient
      .actor("karamelo/twitter-trends-scraper")
      .call(input);

    // Map and process the trends, then sort them by score.
    const { items } = (await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems()) as unknown as PaginatedList<ApifyTwitterTrend>;
    return items
      .map((item: ApifyTwitterTrend) => ({
        trend: item.trend,
        score: parseTweetVolume(item.volume),
      }))
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Error fetching trends from Apify:", error);
    return [];
  }
}
