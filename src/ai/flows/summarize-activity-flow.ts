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
  summary: z.string().describe('El resumen motivacional generado.'),
});
export type SummarizeActivityOutput = z.infer<typeof SummarizeActivityOutputSchema>;


export async function summarizeActivity(input: SummarizeActivityInput): Promise<SummarizeActivityOutput> {
  return summarizeActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeActivityPrompt',
  input: {schema: SummarizeActivityInputSchema},
  output: {schema: SummarizeActivityOutputSchema},
  prompt: `Eres un entrenador de fitness ingenioso y motivador. Tu respuesta debe estar en español.
Basándote en los siguientes datos de actividad, que el usuario ha clasificado como un entrenamiento de "{{selectedSportLabel}}", genera un resumen corto, motivador y con un toque de humor para que lo comparta.
Enfatiza el esfuerzo y el logro. Incluye las estadísticas clave como la distancia y la duración de forma natural. ¡Haz que suene épico!

Datos de la Actividad:
- Duración: {{activityData.duration}}
- Distancia: {{activityData.distance}} km
- Ritmo Promedio: {{#if activityData.avgPace}}{{activityData.avgPace}} min/km{{else}}N/A{{/if}}
- Calorías: {{#if activityData.calories}}{{activityData.calories}} kcal{{else}}N/A{{/if}}
- Frecuencia Cardíaca Promedio: {{#if activityData.avgHeartRate}}{{activityData.avgHeartRate}} ppm{{else}}N/A{{/if}}
- Frecuencia Cardíaca Máxima: {{#if activityData.maxHeartRate}}{{activityData.maxHeartRate}} ppm{{else}}N/A{{/if}}
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
