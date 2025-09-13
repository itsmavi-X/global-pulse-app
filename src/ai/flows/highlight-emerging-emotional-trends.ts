'use server';
/**
 * @fileOverview Identifies and highlights emerging emotional trends and anomalies on the global map.
 *
 * - highlightEmergingEmotionalTrends - A function that identifies and highlights emerging emotional trends.
 * - HighlightEmergingEmotionalTrendsInput - The input type for the highlightEmergingEmotionalTrends function.
 * - HighlightEmergingEmotionalTrendsOutput - The return type for the highlightEmergingEmotionalTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightEmergingEmotionalTrendsInputSchema = z.object({
  socialMediaData: z.string().describe('Real-time data from social media (Reddit/Twitter).'),
  currentMoodMap: z.string().describe('The current global mood map data.'),
});
export type HighlightEmergingEmotionalTrendsInput = z.infer<typeof HighlightEmergingEmotionalTrendsInputSchema>;

const HighlightEmergingEmotionalTrendsOutputSchema = z.object({
  emergingTrends: z.string().describe('A summary of emerging emotional trends and anomalies.'),
});
export type HighlightEmergingEmotionalTrendsOutput = z.infer<typeof HighlightEmergingEmotionalTrendsOutputSchema>;

export async function highlightEmergingEmotionalTrends(input: HighlightEmergingEmotionalTrendsInput): Promise<HighlightEmergingEmotionalTrendsOutput> {
  return highlightEmergingEmotionalTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightEmergingEmotionalTrendsPrompt',
  input: {schema: HighlightEmergingEmotionalTrendsInputSchema},
  output: {schema: HighlightEmergingEmotionalTrendsOutputSchema},
  prompt: `You are an expert in analyzing social media data and identifying emerging emotional trends.

  Analyze the provided social media data and compare it to the current global mood map to identify any significant changes or anomalies.

  Social Media Data: {{{socialMediaData}}}
  Current Mood Map: {{{currentMoodMap}}}

  Based on your analysis, provide a summary of the emerging emotional trends and anomalies. Be specific and highlight any regions or topics where significant changes in sentiment are observed.
  `,
});

const highlightEmergingEmotionalTrendsFlow = ai.defineFlow(
  {
    name: 'highlightEmergingEmotionalTrendsFlow',
    inputSchema: HighlightEmergingEmotionalTrendsInputSchema,
    outputSchema: HighlightEmergingEmotionalTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
