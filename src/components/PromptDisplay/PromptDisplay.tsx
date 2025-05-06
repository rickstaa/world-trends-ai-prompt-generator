/**
 * @file Component to display the generated prompt and provide controls to interact
 * with it.
 */
import {
  Flex,
  Card,
  Text,
  Button,
  Spinner,
  Popover,
  Slider,
} from "@radix-ui/themes";
import { toast } from "sonner";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

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
  const [quality, setQuality] = useState(2);
  const [creativity, setCreativity] = useState(0.5);

  /**
   * Append current Daydream parameters to the Daydream URL.
   *
   * @param url - The base Daydream URL (with an encoded inputPrompt).
   * @returns The updated URL with additional parameters.
   */
  const injectDaydreamParams = (url: string): string => {
    const parsedUrl = new URL(url);
    const encodedPrompt = parsedUrl.searchParams.get("inputPrompt");
    if (!encodedPrompt) {
      console.error(
        "The provided URL does not contain an inputPrompt parameter."
      );
      return url;
    }

    // Add Daydream parameters to inputPrompt and return result.
    const decodedPrompt = atob(encodedPrompt);
    const updatedPrompt = `${decodedPrompt} --quality ${quality} --creativity ${creativity}`;
    const reEncodedPrompt = btoa(updatedPrompt);
    parsedUrl.searchParams.set("inputPrompt", reEncodedPrompt);
    return parsedUrl.toString();
  };

  const renderContent = () =>
    isUpdating ? (
      <Flex direction="column" align="center" justify="center">
        <Spinner size="3" style={{ color: "#fff", marginBottom: "16px" }} />
        <Text
          size="2"
          style={{
            color: "#a1a1aa",
            textAlign: "center",
          }}
        >
          Generating animation prompt...
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
          onClick={() =>
            window.open(
              injectDaydreamParams(daydreamUrl || "https://daydream.live"),
              "_blank"
            )
          }
          variant="solid"
          color="cyan"
          disabled={isUpdating || !prompt}
        >
          Open in Daydream
        </Button>
        {/* Settings Menu */}
        <Popover.Root>
          <Popover.Trigger>
            <Button variant="solid" size="2" color="blue">
              <SlidersHorizontal />
            </Button>
          </Popover.Trigger>
          <Popover.Content width="360px">
            <Flex
              justify="between"
              align="center"
              style={{ marginBottom: "16px" }}
            >
              <Text size="4" weight="bold">
                Adjust Daydream Parameters
              </Text>
              <Popover.Close>
                <Button variant="ghost" size="1" style={{ padding: "0" }}>
                  <X />
                </Button>
              </Popover.Close>
            </Flex>
            <Flex direction="column" gap="4">
              <Text size="2" weight="medium">
                Quality
              </Text>
              <Slider
                defaultValue={[quality]}
                onValueChange={(value) => setQuality(value[0])}
                min={0}
                max={5}
              />
              <Text size="1" color="gray">
                Quality: <strong>{quality}</strong> (0-5)
              </Text>
              <Text size="2" weight="medium">
                Creativity
              </Text>
              <Slider
                defaultValue={[creativity]}
                onValueChange={(value) => setCreativity(value[0])}
                min={0.0}
                max={1.0}
                step={0.1}
              />
              <Text size="1" color="gray">
                Creativity: <strong>{creativity.toFixed(1)}</strong> (0.0-1.0)
              </Text>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </>
  );
};
