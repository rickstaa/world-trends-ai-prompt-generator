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
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{isUpdating && (
					<Flex
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							zIndex: 10,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Spinner size="3" style={{ color: "#fff" }} />
					</Flex>
				)}
				<Text
					size="3"
					style={{
						color: isUpdating ? '#a1a1aa' : '#e5e7eb',
						textAlign: "center",
					}}
				>
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
				disabled={isUpdating}
			>
				Copy Prompt
			</Button>
			{daydreamUrl && (
				<Button
					onClick={() => window.open(daydreamUrl, "_blank")}
					variant="solid"
					color="cyan"
					disabled={isUpdating}
				>
					Open in Daydream
				</Button>
			)}
		</Flex>
	</>
);
