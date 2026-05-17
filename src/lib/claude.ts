import Anthropic from "@anthropic-ai/sdk";
import { KidPreferences, WeekendPlan } from "../types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

const activitySchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    location: { type: "string" },
    time: { type: "string" },
    cost: {
      type: "object",
      properties: {
        entry: { type: "string" },
        parking: { type: "string" },
        total: { type: "number" },
      },
      required: ["entry", "parking", "total"],
    },
    driveTime: { type: "string" },
    whyItsGreat: { type: "string" },
    ageSuitability: { type: "string" },
    mapsUrl: { type: "string" },
    isIndoor: { type: "boolean" },
    tip: {
      type: "string",
      description: "A single actionable pro tip specific to this activity (e.g., 'Arrive 30 min before opening to beat crowds')",
    },
    imageQuery: {
      type: "string",
      description: "Short descriptive search phrase for a relevant stock photo (e.g., 'San Francisco Golden Gate Park children playing')",
    },
  },
  required: ["title", "description", "location", "time", "cost", "driveTime", "whyItsGreat", "ageSuitability", "isIndoor", "tip", "imageQuery"],
};

const weekendPlanTool: Anthropic.Tool = {
  name: "generate_weekend_plan",
  description: "Generate a structured weekend plan for a family with kids",
  input_schema: {
    type: "object",
    properties: {
      saturday: {
        type: "object",
        properties: {
          primary: { type: "array", items: activitySchema },
          planB: { type: "array", items: activitySchema },
        },
        required: ["primary", "planB"],
      },
      sunday: {
        type: "object",
        properties: {
          primary: { type: "array", items: activitySchema },
          planB: { type: "array", items: activitySchema },
        },
        required: ["primary", "planB"],
      },
      weatherForecast: { type: "string" },
    },
    required: ["saturday", "sunday", "weatherForecast"],
  },
};

export async function generateWeekendPlan(prefs: KidPreferences): Promise<WeekendPlan> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: `You are a family weekend activity planner. Create detailed, realistic weekend itineraries for families with kids. Always use the generate_weekend_plan tool to return structured data.

CRITICAL INSTRUCTIONS FOR 2026 REALISM:
1. Realistic 2026 Pricing: It is currently 2026. Ensure all costs reflect modern inflation-adjusted pricing. A typical family meal is rarely under $15-$20 per person unless it's fast food.
2. Budget Awareness: If the budget is low, prioritize free, public, or low-cost activities (parks, libraries, community festivals).
3. Weather Awareness: Consider typical weather for the location and season. If rain or extreme heat is likely, prioritize indoor activities.
4. Plan B (Indoor Fallback): For each day, provide 1-2 indoor backup activities.
5. Detailed Cost Breakdown: For each activity, break down entry fees and parking only (no food). The budget is per person.
6. Drive Time: Estimate drive time from starting address to each activity.
7. Age Suitability: Explicitly state why each activity suits the kids' ages.
8. Maps URL: Provide a full Google Maps Search URL: https://www.google.com/maps/search/?api=1&query=[Place+Name]+[Location]
9. Per-Activity Pro Tip: For each activity, include one practical pro-tip specific to that activity. Examples: 'Arrive 30 min before opening to beat crowds', 'Bring a change of clothes for water splash pads', 'Weekday pricing applies if you go Monday — save 20%'.
10. Image Query: For each activity, provide a short descriptive search phrase suitable for finding a relevant stock photo (e.g., 'San Francisco Golden Gate Park children playing', 'Chicago Museum of Science kids exhibit').
11. Restrictions: Respect any stated family restrictions. Stroller = avoid activities with lots of stairs or uneven terrain. Food allergies = avoid recommending food venues that prominently feature that allergen, and flag any risk in the tip field.`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Create a weekend plan for a family with these details:
Starting From: ${prefs.startingAddress}
Target Locality: ${prefs.targetLocality}
Kids: ${prefs.kids.map((k) => `${k.age}yo`).join(', ')}
Interests: ${prefs.interests.length > 0 ? prefs.interests.join(", ") : "general family activities"}
Budget Ceiling: ${prefs.freeOnly ? 'FREE - prioritize ONLY free or zero-cost activities (parks, public spaces, free museum days, community events)' : `$${prefs.budgetCeiling} per person (entry + parking only, no food)`}
Vibe: ${prefs.vibe}
Profile interests: ${prefs.typicalInterests || 'Not specified'}
This weekend specifically: ${prefs.weekendInterests || 'General family fun'}
Restrictions/Accessibility: ${prefs.restrictions || 'None specified'}

Find real, currently active places or events in the Target Locality. Include 2-3 primary activities per day.`,
      },
    ],
    tools: [weekendPlanTool],
    tool_choice: { type: "tool", name: "generate_weekend_plan" },
  });

  const toolUseBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUseBlock) {
    throw new Error("Could not generate a valid plan. Please try again.");
  }

  return toolUseBlock.input as WeekendPlan;
}
