'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing social media sentiment from Reddit and Twitter.
 *
 * - analyzeSocialMediaSentiment - A function that analyzes social media sentiment.
 * - AnalyzeSocialMediaSentimentInput - The input type for the analyzeSocialMediaSentiment function.
 * - AnalyzeSocialMediaSentimentOutput - The return type for the analyzeSocialMediaSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSocialMediaSentimentInputSchema = z.object({
  region: z.string().describe('The region for which to analyze social media sentiment.'),
  socialMediaSource: z
    .enum(['Reddit', 'Twitter'])
    .describe('The social media source to analyze.'),
  topic: z.string().optional().describe('The topic to filter social media posts by.'),
});
export type AnalyzeSocialMediaSentimentInput = z.infer<
  typeof AnalyzeSocialMediaSentimentInputSchema
>;

const AnalyzeSocialMediaSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the social media posts from the specified region.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence score of the sentiment analysis.'),
});
export type AnalyzeSocialMediaSentimentOutput = z.infer<
  typeof AnalyzeSocialMediaSentimentOutputSchema
>;

export async function analyzeSocialMediaSentiment(
  input: AnalyzeSocialMediaSentimentInput
): Promise<AnalyzeSocialMediaSentimentOutput> {
  return analyzeSocialMediaSentimentFlow(input);
}

const analyzeSocialMediaSentimentPrompt = ai.definePrompt({
  name: 'analyzeSocialMediaSentimentPrompt',
  input: {schema: AnalyzeSocialMediaSentimentInputSchema},
  output: {schema: AnalyzeSocialMediaSentimentOutputSchema},
  prompt: `Analyze the sentiment of social media posts from {{socialMediaSource}} in {{region}} about {{topic}}.\n\nDetermine whether the sentiment is positive, negative, or neutral and provide a confidence score between 0 and 1.\n\nSentiment: \nConfidence: `,
});

const analyzeSocialMediaSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSocialMediaSentimentFlow',
    inputSchema: AnalyzeSocialMediaSentimentInputSchema,
    outputSchema: AnalyzeSocialMediaSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeSocialMediaSentimentPrompt(input);
    return output!;
  }
);
