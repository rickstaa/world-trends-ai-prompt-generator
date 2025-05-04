/**
 * @file Component to display a loading spinner and message.
 */
import { Flex, Spinner, Text } from "@radix-ui/themes";

/**
 * Renders a loading spinner and message.
 * @returns The Loading component.
 */
export const Loading = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    style={{
      height: "100%",
      textAlign: "center",
    }}
  >
    <Spinner size="3" style={{ color: "#fff", marginBottom: "16px" }} />
    <Text
      size="3"
      style={{
        color: "#94a3b8",
        maxWidth: "80%",
      }}
    >
      Fetching world trends and generating your animation prompt...
    </Text>
  </Flex>
);
