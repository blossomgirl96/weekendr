export interface Kid {
  id: string;
  age: number;
}

export interface UserProfile {
  name?: string;
  homeAddress: string;
  kids: Kid[];
  typicalInterests: string;
  restrictions: string;
}

export interface KidPreferences {
  startingAddress: string;
  targetLocality: string;
  kids: Kid[];
  interests: string[];
  budgetCeiling: number;
  freeOnly?: boolean;
  vibe: 'active' | 'educational' | 'relaxing' | 'creative';
  weekendInterests?: string;
  typicalInterests?: string;
  restrictions?: string;
}

export interface CostBreakdown {
  entry: string;
  parking: string;
  total: number;
}

export interface Activity {
  title: string;
  description: string;
  location: string;
  time: string;
  cost: CostBreakdown;
  driveTime: string;
  whyItsGreat: string;
  ageSuitability: string;
  mapsUrl?: string;
  isIndoor: boolean;
  tip?: string;
  imageQuery?: string;
}

export interface DayPlan {
  primary: Activity[];
  planB: Activity[]; // Indoor fallback
}

export interface WeekendPlan {
  saturday: DayPlan;
  sunday: DayPlan;
  weatherForecast: string;
}
