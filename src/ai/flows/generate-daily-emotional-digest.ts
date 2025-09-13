'use server';
/**
 * @fileOverview Generates a daily summary of emotional trends by region using generative AI.
 *
 * - generateDailyEmotionalDigest - A function that generates the daily emotional digest.
 * - GenerateDailyEmotionalDigestInput - The input type for the generateDailyEmotionalDigest function.
 * - GenerateDailyEmotionalDigestOutput - The return type for the generateDailyEmotionalDigest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyEmotionalDigestInputSchema = z.object({
  region: z.string().describe('The region for which to generate the emotional digest.'),
  positiveKeywords: z.array(z.string()).describe('Keywords associated with positive sentiment in the region.'),
  negativeKeywords: z.array(z.string()).describe('Keywords associated with negative sentiment in the region.'),
});
export type GenerateDailyEmotionalDigestInput = z.infer<typeof GenerateDailyEmotionalDigestInputSchema>;

const GenerateDailyEmotionalDigestOutputSchema = z.object({
  summary: z.string().describe('A summary of the emotional trends in the region, including trending issues.'),
});
export type GenerateDailyEmotionalDigestOutput = z.infer<typeof GenerateDailyEmotionalDigestOutputSchema>;

export async function generateDailyEmotionalDigest(
  input: GenerateDailyEmotionalDigestInput
): Promise<GenerateDailyEmotionalDigestOutput> {
  return generateDailyEmotionalDigestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyEmotionalDigestPrompt',
  input: {schema: GenerateDailyEmotionalDigestInputSchema},
  output: {schema: GenerateDailyEmotionalDigestOutputSchema},
  prompt: `You are an AI assistant that summarizes the daily emotional trends in a given region.

  Region: {{region}}
  Positive Keywords: {{#each positiveKeywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Negative Keywords: {{#each negativeKeywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Generate a concise summary (1-2 sentences) of the emotional trends in the region, including the trending issues associated with both positive and negative sentiments.  Focus on the primary emotions and key topics driving them.  Avoid speculation and stick to the provided keywords when crafting the summary.
  `,
});

const generateDailyEmotionalDigestFlow = ai.defineFlow(
  {
    name: 'generateDailyEmotionalDigestFlow',
    inputSchema: GenerateDailyEmotionalDigestInputSchema,
    outputSchema: GenerateDailyEmotionalDigestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
