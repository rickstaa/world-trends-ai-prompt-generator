/**
 * @file Component to display the generated prompt and provide controls to interact
 * with it.
 */
import { Flex, Card, Text, Button } from "@radix-ui/themes";
import { toast } from "sonner";

/** Interface representing the props for the PromptDisplay component */
interface PromptDisplayProps {
    /** The generated prompt to display */
    prompt: string | null;
    /** The URL to open in Daydream */
    daydreamUrl: string | null;
}

/**
 * Renders the generated prompt and provides options to copy it or open in Daydream.
 * @param props - The component props.
 * @returns The PromptDisplay component.
 */
export const PromptDisplay = ({
    prompt,
    daydreamUrl,
}: PromptDisplayProps) => (
    <>
        <Flex justify="center" style={{ marginBottom: 16 }}>
            <Text size="4" weight="bold">
                Generated Prompt
            </Text>
        </Flex>
        <Flex justify="center">
            <Card
                size="3"
                style={{
                    backgroundColor: "#212121e6",
                    maxWidth: "90%",
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 16,
                }}
            >
                <Text size="3" style={{ color: "#e5e7eb" }}>
                    {prompt || "No prompt available."}
                </Text>
            </Card>
        </Flex>
        {/* Controls */}
        <Flex justify="center" gap="4" style={{ marginBottom: 16 }}>
            <Button
                onClick={() => {
                    navigator.clipboard.writeText(prompt || "");
                    toast("Prompt copied to clipboard!");
                }}
                variant="solid"
            >
                Copy Prompt
            </Button>
            {daydreamUrl && (
                <Button
                    onClick={() => window.open(daydreamUrl, "_blank")}
                    variant="solid"
                    color="cyan"
                >
                    Open in Daydream
                </Button>
            )}
        </Flex>
    </>
);
