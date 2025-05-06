/**
 * @file Utility functions for generating animation prompts from web trends.
 */

import { Livepeer } from "@livepeer/ai";
import OpenAI from "openai";
import { normalizeTrendScores } from "@/lib/utils";

const openAiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
const livepeerClient = new Livepeer({
  httpBearer: process.env.LIVEPEER_API_TOKEN,
});

const SYSTEM_PROMPT = `
  You generate high-impact visual prompts for real-time AI animation. Only output
  compact keyword-style prompts using '::' separators. Focus purely on visual elements:
  character traits, textures, lighting, stylistic techniques, symbolism. No full
  sentences, no narration, no explanations. Match this style format exactly: 'hooded
  figure in ceremonial armor :: sacred geometry background :: brushed gold texture ::
  precise ink linework :: stylized realism, 4k'
`;

/**
 * Cleans the output by removing newlines, Llama headers, leading "::", and
 * trailing "::".
 *
 * @param output - The raw output string from the Llama model.
 * @returns The cleaned output string.
 */
const removeLlamaHeaders = (output: string): string => {
  return output
    .replace(/\n+/g, " ") // Replace newlines with a single space
    .replace(/<\|start_header_id\|>.*?<\|end_header_id\|>/gs, "") // Remove Llama headers
    .replace(/^\s*::\s*/, "") // Remove leading "::" with optional spaces
    .replace(/\s*::\s*$/, "") // Remove trailing "::" with optional spaces
    .trim(); // Trim leading and trailing spaces
};

/**
 * Attempts to generate a prompt using the provided client and request.
 *
 * @param client - The AI client (Livepeer or OpenAI).
 * @param request - The request payload for the client.
 * @param isLivepeer - Whether the client is Livepeer (affects request structure).
 * @returns The generated prompt or null if the client fails.
 */
const tryGeneratePrompt = async (
  client: any,
  request: any,
  isLivepeer: boolean
): Promise<string | null> => {
  try {
    const response = isLivepeer
      ? await client.generate.llm({ ...request, maxTokens: 72 })
      : await client.chat.completions.create({
          ...request,
          model: "gpt-3.5-turbo",
          max_tokens: 59,
        });

    const content = isLivepeer
      ? response?.llmResponse?.choices?.[0]?.message?.content
      : response.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Response did not contain valid content.");
    }

    return isLivepeer ? removeLlamaHeaders(content) : content;
  } catch (error) {
    console.error(
      `${isLivepeer ? "Livepeer" : "OpenAI"} request failed:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
};

/**
 * Generates a concise animation prompt based on the provided trends and their
 * importance.
 *
 * @param trends - An array of trends, each with a name and a score.
 * @returns A promise that resolves to the generated animation prompt as a string.
 * @throws An error if both Livepeer and OpenAI fail to generate the prompt.
 */
export const generateAnimationPrompt = async (
  trends: { trend: string; score: number }[]
): Promise<string> => {
  if (!Array.isArray(trends) || trends.length === 0) {
    throw new Error("Invalid or empty trends data");
  }

  // Normalize the trends and create a weighted description.
  const normalizedTrends = normalizeTrendScores(trends);
  const weightedDescription = normalizedTrends
    .map((trend) => `${trend.trend} (importance: ${trend.score.toFixed(2)}%)`)
    .join(", ");

  const request = {
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate concise animation instructions based on the following trends
        and their importance: ${weightedDescription}.`,
      },
    ],
  };

    // Attempts to generate an animation prompt using Livepeer and then OpenAI.
    let content: string | null = null;
    if (livepeerClient) {
      content = await tryGeneratePrompt(livepeerClient, request, true);
    }
    if (!content && openAiClient) {
      content = await tryGeneratePrompt(openAiClient, request, false);
    }
  
    // If both services fail, throw an error.
    if (!content) {
      throw new Error(
        "Unable to generate animation prompt. Please try again later."
      );
    }
  
    // Clean up the content by trimming double whitespaces and newlines.
    return content.replace(/\s+/g, " ").trim();
};
