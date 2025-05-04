/**
 * @file Component to display a list of web trends as badges.
 */
import { Flex, Badge, Tooltip } from "@radix-ui/themes";
import { Trend } from "@/types";
import { normalizeTrendScores } from "@/lib/utils";

/** Interface representing the props for the TrendsList component */
interface TrendListProps {
  /** List of trends with their scores */
  trends: Trend[];
  /** Set of currently selected trends */
  selectedTrends: Set<string>;
  /** Function to toggle trend selection */
  toggleTrendSelection: (trend: string) => void;
}

/**
 * Renders a list of web trends as badges.
 * 
 * @param props - The component props.
 * @returns The TrendsList component.
 */
export const TrendsList = ({
  trends,
  selectedTrends,
  toggleTrendSelection,
}: TrendListProps) => {
  // Filter selected trends
  const selectedTrendsArray = trends.filter((trend) =>
    selectedTrends.has(trend.trend)
  );

  // Normalize scores for selected trends
  const normalizedSelectedTrends = normalizeTrendScores(selectedTrendsArray);

  // Overwrite the scores of the original trends
  const normalizedTrends = trends.map((trend) => {
    const normalizedTrend = normalizedSelectedTrends.find(
      (t) => t.trend === trend.trend
    );
    return normalizedTrend
      ? { ...trend, score: normalizedTrend.score }
      : { ...trend, score: 0 }; // Set unselected trends to 0
  });

  return (
    <Flex
      wrap="wrap"
      gap="2"
      justify="center"
      style={{
        maxWidth: "90%",
        overflowY: "auto",
        marginBottom: 16,
        marginTop: 16,
      }}
    >
      {normalizedTrends.map((trend, index) => (
        <Tooltip content="Toggle trend for prompt" key={index}>
          <Badge
            key={index}
            variant="soft"
            size="2"
            color={selectedTrends.has(trend.trend) ? "green" : "gray"}
            style={{
              cursor: "pointer",
            }}
            onClick={() => toggleTrendSelection(trend.trend)}
          >
            {trend.trend} ({trend.score.toFixed(2)}%)
          </Badge>
        </Tooltip>
      ))}
    </Flex>
  );
};
