/**
 * @file Home page of the application.
 */
"use client";
import { useEffect, useMemo, useState } from "react";
import { Flex, Card, Box, Separator, Text } from "@radix-ui/themes";
import { Toaster } from "sonner";
import { Loading } from "@/components/Loading";
import { Error as ErrorComponent } from "@/components/Error";
import { PromptDisplay } from "@/components/PromptDisplay";
import { TrendsList } from "@/components/TrendsList";
import { useDebounce } from "@/hooks/useDebounce";
import { Trend } from "@/types";
import { GithubCorner } from "@/components/GithubCorner";

/**
 * Fetches the latest web trends from the server.
 * @returns A promise that resolves to the latest trends.
 */
async function fetchTrendsAPI() {
  const response = await fetch("/api/trends");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch trends");
  }
  return data.trends;
}

/**
 * Generates a prompt based on the selected trends.
 * @param filteredTrends - The filtered trends to generate the prompt from.
 * @returns A promise that resolves to the generated prompt.
 */
async function generatePromptAPI(
  filteredTrends: { trend: string; score: number }[]
) {
  const response = await fetch("/api/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trends: filteredTrends }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to generate prompt");
  }
  return data;
}

/**
 * Renders the home page of the application.
 */
export default function HomePage() {
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [promptIsUpdating, setPromptIsUpdating] = useState(true);
  const [daydreamUrl, setDaydreamUrl] = useState<string | null>(null);
  const [trends, setTrends] = useState<{ trend: string; score: number }[]>([]);
  const [selectedTrends, setSelectedTrends] = useState<Set<string>>(new Set());
  const debouncedGeneratePrompt = useDebounce((filteredTrends) => {
    generatePrompt(filteredTrends);
  }, 1000);
  const filteredTrends = useMemo(
    () => trends.filter((t) => selectedTrends.has(t.trend)),
    [trends, selectedTrends]
  );

  /**
   * Toggles the selection of a trend and updates the prompt accordingly.
   * @param trend - The trend to toggle.
   */
  const toggleTrendSelection = (trend: string) => {
    setSelectedTrends((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(trend)) {
        newSet.delete(trend);
      } else {
        newSet.add(trend);
      }
      return newSet;
    });

    debouncedGeneratePrompt(filteredTrends);
  };
  /**
   * Generates a prompt based on the selected trends and updates the state.
   * @param filteredTrends - The filtered trends to generate the prompt from.
   */
  const generatePrompt = async (
    filteredTrends: { trend: string; score: number }[]
  ) => {
    try {
      setPromptIsUpdating(true);
      const { prompt, daydreamUrl } = await generatePromptAPI(filteredTrends);
      setPromptIsUpdating(false);
      setPrompt(prompt);
      setDaydreamUrl(daydreamUrl);
    } catch (err) {
      console.error("Error generating prompt:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate prompt"
      );
    }
  };

  useEffect(() => {
    /** Fetches trends and generates the initial prompt. */
    const initializeData = async () => {
      try {
        const trends = await fetchTrendsAPI();
        setTrends(trends);
        setSelectedTrends(new Set(trends.map((trend: Trend) => trend.trend)));
        await generatePrompt(trends);
      } catch (err) {
        console.error("Error initializing data:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize data");
      } finally {
        setPromptIsUpdating(false);
      }
    };
  
    initializeData();
  }, []);

  return (
    <>
      <GithubCorner href="https://github.com/rickstaa/world-trends-ai-prompt-generator" />
      <Toaster />
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={{
          height: "100vh",
        }}
      >
        <Card
          size="4"
          style={{
            maxWidth: "600px",
            minHeight: "500px",
            width: "100%",
            padding: 24,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box style={{ marginBottom: 16, textAlign: "center" }}>
            <Text size="7" weight="bold">
              World Trends AI Prompt Generator
            </Text>
          </Box>
          <Flex justify="center">
            <Separator style={{ marginBottom: 16, width: "95%" }} />
          </Flex>

          <Flex
            direction="column"
            align="center"
            justify="center"
            style={{
              flex: 1,
            }}
          >
            {trends.length === 0 ? (
              <Loading />
            ) : error ? (
              <ErrorComponent message={error} />
            ) : (
              <>
                <PromptDisplay
                  prompt={prompt}
                  daydreamUrl={daydreamUrl}
                  isUpdating={promptIsUpdating}
                />
                <TrendsList
                  trends={trends}
                  selectedTrends={selectedTrends}
                  toggleTrendSelection={toggleTrendSelection}
                />
              </>
            )}
          </Flex>
        </Card>
      </Flex>
    </>
  );
}
