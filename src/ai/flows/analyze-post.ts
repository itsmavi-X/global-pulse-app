'use server';
/**
 * @fileOverview An AI flow for analyzing social media posts to detect trends, sentiment, and narratives.
 *
 * - analyzePost - A function that handles the post analysis process.
 * - AnalyzePostInput - The input type for the analyzePost function.
 * - AnalyzePostOutput - The return type for the analyzePost function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzePostInputSchema = z.object({
  postText: z.string().describe('The text content of the social media post to analyze.'),
});
export type AnalyzePostInput = z.infer<typeof AnalyzePostInputSchema>;

const AnalyzePostOutputSchema = z.object({
  country: z.string().describe("Country most likely associated with the post, or 'Unknown'"),
  topic: z.string().describe("Short string identifying the main theme of the post"),
  sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe("The post's sentiment"),
  emotionalIntensity: z.number().min(1).max(10).describe("How strongly the sentiment is expressed (1 = weak, 10 = very strong)"),
  summary: z.string().describe("A single sentence summarizing the post"),
  keywords: z.array(z.string()).describe("2-3 important keywords from the post"),
  digestHeadline: z.string().describe("Short, catchy headline summarizing the trend this post contributes to"),
  zeitgeistPulse: z.number().min(0).max(100).describe("0–100 score estimating how much this post contributes to overall buzz"),
  subreddit: z.string().describe("Subreddit where the post was found or 'Unknown'"),
  latitude: z.number().describe("Approximate latitude for globe plotting"),
  longitude: z.number().describe("Approximate longitude for globe plotting"),
});
export type AnalyzePostOutput = z.infer<typeof AnalyzePostOutputSchema>;

export async function analyzePost(input: AnalyzePostInput): Promise<AnalyzePostOutput> {
  return analyzePostFlow(input);
}

const analyzePostPrompt = ai.definePrompt({
  name: 'analyzePostPrompt',
  input: { schema: AnalyzePostInputSchema },
  output: { schema: AnalyzePostOutputSchema },
  prompt: `You are an AI that analyzes social media posts to detect global trends, emotional sentiment, and emerging narratives.

Given a post, return ONLY a valid JSON object.

### JSON Schema to follow:
{
  "country": "Country most likely associated with the post, or 'Unknown'",
  "topic": "Short string identifying the main theme of the post",
  "sentiment": "Positive | Negative | Neutral",
  "emotionalIntensity": 1-10,
  "summary": "A single sentence summarizing the post",
  "keywords": ["2-3 important keywords from the post"],
  "digestHeadline": "Short, catchy headline summarizing the trend this post contributes to",
  "zeitgeistPulse": 0-100,
  "subreddit": "Subreddit where the post was found or 'Unknown'",
  "latitude": 0.0,
  "longitude": 0.0
}

### Field Details:
- country → Determine the country if mentioned or implied; else 'Unknown'.
- topic → Main theme or narrative of the post (e.g., "AI regulation", "Climate anxiety").
- sentiment → Positive, Negative, or Neutral only.
- emotionalIntensity → How strongly the sentiment is expressed (1 = weak, 10 = very strong).
- summary → Concise single-sentence overview.
- keywords → 2–3 strong keywords relevant to the post.
- digestHeadline → Short headline suitable for daily emotional digest.
- zeitgeistPulse → 0–100 score estimating how much this post contributes to overall buzz.
- subreddit → Name of subreddit or "Unknown".
- latitude & longitude → approximate geographic coordinates of the country or main location referenced (needed for globe/map visualization).

### Output Rules:
- Return ONLY valid JSON.
- Fill all fields; do not leave blanks.
- Latitude and longitude must be realistic decimal numbers.
- Country must match latitude/longitude.

Post to analyze:
"{{{postText}}}"
`,
});

const analyzePostFlow = ai.defineFlow(
  {
    name: 'analyzePostFlow',
    inputSchema: AnalyzePostInputSchema,
    outputSchema: AnalyzePostOutputSchema,
  },
  async (input) => {
    const { output } = await analyzePostPrompt(input);
    return output!;
  }
);
