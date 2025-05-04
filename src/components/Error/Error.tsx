/**
 * @file Component to display an error message.
 */
import { Flex, Text } from "@radix-ui/themes";

interface ErrorProps {
  /** The error message to display */
  message: string;
}

/**
 * Renders an error message.
 * @param props - The component props.
 * @returns The Error component.
 */
export const Error = ({ message }: ErrorProps) => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    style={{
      height: "100%",
      textAlign: "center",
    }}
  >
    <Text
      size="6"
      weight="bold"
      style={{
        color: "#f87171",
        marginBottom: "8px",
        wordWrap: "break-word",
      }}
    >
      Error:{" "}
      <span style={{ color: "#e5e7eb" }}>{message || "An error occurred."}</span>
    </Text>
    <Text
      size="3"
      style={{
        color: "#94a3b8",
        marginTop: "12px",
      }}
    >
      Please try again later.
    </Text>
  </Flex>
);
