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
        food: { type: "string" },
        total: { type: "number" },
      },
      required: ["entry", "parking", "food", "total"],
    },
    driveTime: { type: "string" },
    whyItsGreat: { type: "string" },
    ageSuitability: { type: "string" },
    mapsUrl: { type: "string" },
    isIndoor: { type: "boolean" },
  },
  required: ["title", "description", "location", "time", "cost", "driveTime", "whyItsGreat", "ageSuitability", "isIndoor"],
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
      tips: { type: "array", items: { type: "string" } },
      weatherForecast: { type: "string" },
    },
    required: ["saturday", "sunday", "tips", "weatherForecast"],
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
5. Detailed Cost Breakdown: For each activity, break down entry fees, parking, and typical food spend.
6. Drive Time: Estimate drive time from starting address to each activity.
7. Age Suitability: Explicitly state why each activity suits the kids' ages.
8. Maps URL: Provide a full Google Maps Search URL: https://www.google.com/maps/search/?api=1&query=[Place+Name]+[Location]`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Create a weekend plan for a family with these details:
Starting From: ${prefs.startingAddress}
Target Locality: ${prefs.targetLocality}
Kids Ages: ${prefs.kids.map((k) => k.age).join(", ")}
Interests: ${prefs.interests.length > 0 ? prefs.interests.join(", ") : "general family activities"}
Budget Ceiling: $${prefs.budgetCeiling} (whole family, all costs included)
Vibe: ${prefs.vibe}

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
