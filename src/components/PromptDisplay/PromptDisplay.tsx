/**
 * @file Component to display the generated prompt and provide controls to interact
 * with it.
 */
import { Flex, Card, Text, Button, Spinner } from "@radix-ui/themes";
import { toast } from "sonner";

/** Interface representing the props for the PromptDisplay component */
interface PromptDisplayProps {
  /** The generated prompt to display */
  prompt: string | null;
  /** The URL to open in Daydream */
  daydreamUrl: string | null;
  /** Flag indicating if the prompt is being updated */
  isUpdating: boolean;
}

/**
 * Renders the generated prompt and provides options to copy it or open in Daydream.
 * @param props - The component props.
 * @returns The PromptDisplay component.
 */
export const PromptDisplay = ({
  prompt,
  daydreamUrl,
  isUpdating,
}: PromptDisplayProps) => {
  const renderContent = () => (
    isUpdating ? (
      <Flex direction="column" align="center" justify="center">
        <Spinner size="3" style={{ color: "#fff", marginBottom: "16px"}} />
        <Text
          size="2"
          style={{
            color: "#a1a1aa",
            textAlign: "center",
          }}
        >
          Generating prompt...
        </Text>
      </Flex>
    ) : prompt ? (
      <Text
        size="3"
        style={{
          color: "#94a3b8",
          maxWidth: "80%",
          textAlign: "center",
        }}
      >
        {prompt}
      </Text>
    ) : (
      <Text
        size="3"
        style={{
          color: "#ff4d4f",
          textAlign: "center",
        }}
      >
        No prompt found, please try again.
      </Text>
    )
  );

  return (
    <>
      <Flex justify="center">
        <Text size="4" weight="bold">
          Generated Prompt
        </Text>
      </Flex>
      <Flex justify="center">
        <Card
          size="1"
          style={{
            backgroundColor: "#212121e6",
            maxWidth: "90%",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "400px",
            minHeight: "150px",
            position: "relative",
          }}
        >
          {renderContent()}
        </Card>
      </Flex>
      {/* Controls */}
      <Flex justify="center" gap="4">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(prompt || "");
            toast("Prompt copied to clipboard!");
          }}
          variant="solid"
          disabled={isUpdating || !prompt}
        >
          Copy Prompt
        </Button>

        <Button
          onClick={() => window.open(daydreamUrl || "https://daydream.live", "_blank")}
          variant="solid"
          color="cyan"
          disabled={isUpdating || !prompt}
        >
          Open in Daydream
        </Button>
      </Flex>
    </>
  );
};
