'use server';
/**
 * @fileOverview An AI flow to generate a motivational summary for a fitness activity.
 *
 * - summarizeActivity - A function that generates a summary for a given activity.
 * - SummarizeActivityInput - The input type for the summarizeActivity function.
 * - SummarizeActivityOutput - The return type for the summarizeActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FitDataSchema = z.object({
  activityType: z.string(),
  sport: z.string(),
  startTime: z.string().describe("The start time of the activity in ISO format."),
  duration: z.string(),
  distance: z.number(),
  avgPace: z.string().optional(),
  calories: z.number().optional(),
  avgHeartRate: z.number().optional(),
  maxHeartRate: z.number().optional(),
});

const SummarizeActivityInputSchema = z.object({
  activityData: FitDataSchema,
  selectedSportLabel: z.string().describe("The label of the sport selected by the user, e.g., 'Trail Running'."),
});
export type SummarizeActivityInput = z.infer<typeof SummarizeActivityInputSchema>;

const SummarizeActivityOutputSchema = z.object({
  summary: z.string().describe('The generated motivational summary.'),
});
export type SummarizeActivityOutput = z.infer<typeof SummarizeActivityOutputSchema>;


export async function summarizeActivity(input: SummarizeActivityInput): Promise<SummarizeActivityOutput> {
  return summarizeActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeActivityPrompt',
  input: {schema: SummarizeActivityInputSchema},
  output: {schema: SummarizeActivityOutputSchema},
  prompt: `You are a witty and encouraging fitness coach.
Based on the following activity data, which the user has now classified as a "{{selectedSportLabel}}" workout, generate a short, motivational, and slightly humorous summary for them to share.
Emphasize the effort and achievement. Include the key stats like distance and duration in a natural way. Make it sound epic!

Activity Data:
- Duration: {{activityData.duration}}
- Distance: {{activityData.distance}} km
- Average Pace: {{#if activityData.avgPace}}{{activityData.avgPace}} min/km{{else}}N/A{{/if}}
- Calories: {{#if activityData.calories}}{{activityData.calories}} kcal{{else}}N/A{{/if}}
- Average Heart Rate: {{#if activityData.avgHeartRate}}{{activityData.avgHeartRate}} bpm{{else}}N/A{{/if}}
- Max Heart Rate: {{#if activityData.maxHeartRate}}{{activityData.maxHeartRate}} bpm{{else}}N/A{{/if}}
`
});

const summarizeActivityFlow = ai.defineFlow(
  {
    name: 'summarizeActivityFlow',
    inputSchema: SummarizeActivityInputSchema,
    outputSchema: SummarizeActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
