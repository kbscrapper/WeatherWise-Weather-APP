'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating weather-based tips.
 *
 * - weatherTips - A function that generates weather tips based on current conditions.
 * - WeatherTipsInput - The input type for the weatherTips function.
 * - WeatherTipsOutput - The return type for the weatherTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherTipsInputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity (percentage).'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
  condition: z.string().describe('A short description of the weather condition (e.g., sunny, rainy, cloudy).'),
});
export type WeatherTipsInput = z.infer<typeof WeatherTipsInputSchema>;

const WeatherTipsOutputSchema = z.object({
  tip: z.string().describe('A tip based on the current weather conditions.'),
});
export type WeatherTipsOutput = z.infer<typeof WeatherTipsOutputSchema>;

export async function weatherTips(input: WeatherTipsInput): Promise<WeatherTipsOutput> {
  return weatherTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherTipsPrompt',
  input: {schema: WeatherTipsInputSchema},
  output: {schema: WeatherTipsOutputSchema},
  prompt: `You are a helpful weather assistant. Based on the current weather conditions, provide one concise tip to the user.

Current Conditions:
- Temperature: {{temperature}}°C
- Humidity: {{humidity}}%
- Wind Speed: {{windSpeed}} km/h
- Condition: {{condition}}

Tip:`,
});

const weatherTipsFlow = ai.defineFlow(
  {
    name: 'weatherTipsFlow',
    inputSchema: WeatherTipsInputSchema,
    outputSchema: WeatherTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
