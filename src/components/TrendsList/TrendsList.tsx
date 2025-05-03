/**
 * @file Component to display a list of web trends as badges.
 */
import { Flex, Badge, Tooltip } from "@radix-ui/themes";
import { Trend } from "@/types";

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
}: TrendListProps) => (
  <Flex
    wrap="wrap"
    gap="2"
    justify="center"
    style={{
      maxWidth: "90%",
      overflowY: "auto",
      marginBottom: 20,
      marginTop: 16,
    }}
  >
    {trends.map((trend, index) => (
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
          {trend.trend} ({Math.max(trend.score, 0).toFixed(2)}%)
        </Badge>
      </Tooltip>
    ))}
  </Flex>
);
