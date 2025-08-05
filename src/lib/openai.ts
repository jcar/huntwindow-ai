import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getForecastFromAI({
  species,
  zip,
  weatherDays,
  ebirdSummary,
}: {
  species: string;
  zip: string;
  weatherDays: any[];
  ebirdSummary: string;
}): Promise<string> {
  

let speciesNotes = '';

switch (species.toLowerCase()) {
  case 'dove':
    speciesNotes = `Focus on open fields, tree lines, watering holes, and high afternoon activity. Wind direction matters for flight paths. Avoid full moon mornings.`;
    break;
  case 'duck':
    speciesNotes = `Prioritize water bodies like ponds, lakes, or flooded timber. Use decoys and early morning scouting. Wind and fronts strongly affect migration. Cloud cover and barometric pressure are important.`;
    break;
  case 'whitetail deer':
    speciesNotes = `Focus on wind direction, bedding and feeding transitions, and low human pressure. Early morning and dusk are critical. Moon phase can influence movement, especially pre- and post-rut.`;
    break;
  default:
    speciesNotes = `Apply best practices based on weather and season.`;
}

const systemPrompt = `
You are a professional hunting guide.
Given the species, ZIP code, and weather forecast, recommend when and how to hunt.
Use practical, hunter-tested strategies, not just textbook knowledge.

Species Guidance:
${speciesNotes}
`;

  const weatherSummary = weatherDays.map((day, i) => {
    return `
${i + 1}. Date: ${day.date}
    - Temp: ${day.tempMin}–${day.tempMax}°F
    - Wind: ${day.windSpeed} mph (${day.windDirection}°)
    - UV Index: ${day.uvIndex}
    - Sunrise: ${day.sunrise}, Sunset: ${day.sunset}
    - Moon Phase: ${day.moonPhase.toFixed(2)}
    `;
  }).join("\n");

  const userPrompt = `
You are a hunting forecast assistant. Based on the following inputs, generate a structured forecast for a hunter targeting ${species} in ZIP code ${zip}.

## Inputs:
- Weather Forecast (daily):
${weatherSummary}

- Recent Bird Sightings (eBird):
${ebirdSummary || "No eBird data available for this species."}

## Your Output:

Respond with clear, helpful guidance in this format:

---
### 📅 Best Day(s) and Time(s) to Hunt:
[Which day(s) this week are best based on weather, sightings, and species behavior. Be specific: e.g., "Saturday morning due to cloud cover and N wind."]

### 🎯 Recommended Tactics:
[Tips on how to hunt this species under the given conditions: e.g., "Use decoys near water", "Hunt tree lines at dawn", etc.]

### 📈 Movement & Weather Summary:
[Why the animals are likely to be active or inactive based on temperature swings, wind direction, pressure, moon, etc.]

### ✅ Final Recommendation:
[A concise 1-2 sentence actionable insight. Example: "Plan to hunt early Saturday near flooded fields with overcast skies. Expect moderate movement."]
---
`;

console.log("Final Prompt to OpenAI:", userPrompt);

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  return res.choices[0].message?.content || 'No forecast generated.';
}